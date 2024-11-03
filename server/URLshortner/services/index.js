import URLshortnerModel from '../models/index.js';
import logger from '../../../common/utils/logger/index.js';
import URLutils from '../../../common/utils/urlUtils/index.js';
import redisCache from '../../../common/helpers/cach.js';
import AccessLogModel from '../models/accessLog.js';
import URLshortnerMiddleware from   '../middleware/index.js';

const serviceName = 'server.URLshortner.services.index';
class URLshortnerService{
    static async createShortUrl(originalUrl, expirationDate, clientIp,userId) {
        const functionName = 'createShortUrl';
        try {

            if (!URLutils.isValidUrl(originalUrl)) {
                throw new Error('Invalid URL');

            }
            if (!URLutils.isValidExpirationDate(expirationDate)) {
                throw new Error('Invalid expiration date');
            }

            // Convert expiration date to Date object
            const expiryDate = new Date(expirationDate);

            
            // Check if URL already exists
            const existingShortUrl = await URLshortnerModel.getShortUrl(originalUrl,userId);
            
            if (existingShortUrl) {
                // Cache the short URL
                await redisCache.setCache(existingShortUrl.short_url,existingShortUrl.original_url,existingShortUrl.id);
                // Increment visit count
                await URLshortnerModel.incrementVisitCount(existingShortUrl.short_url);
                // Create access log
                await URLshortnerMiddleware.createAccessLog(clientIp, existingShortUrl.id);
                
                return existingShortUrl.short_url; // already exists in DB
            }
            
            // --------------------------- URL is never shortened before --------------------------------

            // Generate short URL
            const shortUrl = URLutils.generateShortUrl();
            if (!shortUrl) {
                throw new Error('Internal Server Error - shortUrl not generated- ');
                
            }

            // Create short URL
            const URLshorted = await URLshortnerModel.createShortUrl(originalUrl, shortUrl , expiryDate,userId);
            if (!URLshorted) {
                throw new Error('Internal Server Error - shortUrl was not created');
            }

            // Create access log
            await URLshortnerMiddleware.createAccessLog(clientIp, URLshorted.id);

            // Cache the short URL
            await redisCache.setCache(URLshorted.short_url,URLshorted.original_url,URLshorted.id);

           
            // Return short URL
            return URLshorted.short_url; 
          
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
    
        }
    }



    static async getOriginalUrl(shortUrl, clientIp) {
        const functionName = 'getOriginalUrl';
        try {
             // Check cache first
            const cachedUrl = await redisCache.getCache(shortUrl);
            if (cachedUrl) {
                // Increment visit count
                await URLshortnerModel.incrementVisitCount(shortUrl);
                const { value: originalUrl, urlId } = cachedUrl;
                // Create access log
                await URLshortnerMiddleware.createAccessLog(clientIp, urlId);
                // Return original URL
                return originalUrl;
            }

            const originalUrl = await URLshortnerModel.getOriginalUrl(shortUrl);
            if (!originalUrl) {
                throw new Error('URL not found');
            }

            // Increment visit count
            await URLshortnerModel.incrementVisitCount(shortUrl);

            // Cache the original URL
            await redisCache.setCache(shortUrl, originalUrl);

            return originalUrl;
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
        }
    }

    static async deleteExpiredURLs() {
        const functionName = 'deleteExpiredURLs';
        try {
            const deletedURLs = await URLshortnerModel.deleteExpiredUrls();
            return deletedURLs;
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
        }
    }


    
}

export default URLshortnerService;