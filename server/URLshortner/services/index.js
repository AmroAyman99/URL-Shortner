import URLshortnerModel from '../models/index.js';
import logger from '../../../common/utils/logger/index.js';
import URLutils from '../../../common/utils/urlUtils/index.js';
import redisCache from '../../../common/helpers/Redis/cach.js';
import URLshortnerMiddleware from   '../middleware/index.js';
import RedisMessageQueue from "../../../common/helpers/Redis/messageQueue.js";
const serviceName = 'server.URLshortner.services.index';
class URLshortnerService{
    // create a short url record in db - if exists return the existed short url
    static async createShortUrl(originalUrl, expirationDate,userId) {

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
                await redisCache.setCache(existingShortUrl.short_url, existingShortUrl.original_url, existingShortUrl.id, existingShortUrl.userId, existingShortUrl.visitCount, existingShortUrl.expirationDate);
            
                
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

            

            // Cache the short URL
            await redisCache.setCache(URLshorted.short_url, URLshorted.original_url, URLshorted.id, URLshorted.userId, URLshorted.visitCount, URLshorted.expirationDate);

           
            // Return short URL
            return URLshorted.short_url; 
          
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
    
        }
    }


// get original url from cache or db

    static async getOriginalUrl(shortUrl,userId=null, clientIp=null) {
        const functionName = 'getOriginalUrl';
        try {
             // Check cache first
            const cachedUrl = await redisCache.getCache(shortUrl, userId);
            if (cachedUrl){
                const { value: originalUrl, urlId , user_id, visitCount, expirationDate } = cachedUrl;
                
                if (userId && !URLshortnerMiddleware.checkPremission(user_id,userId)){
                    throw new Error('Unauthorized User : you are not allowed to access this shortURL');
                }
                
                // Increment visit count
                // publish a message to the queue
                const message = {message:`URL with id ${urlId} was visited`,shortUrl:shortUrl};
                RedisMessageQueue.publishMessage(JSON.stringify(message));


                // Create access log
                if(clientIp){
                    await URLshortnerMiddleware.createAccessLog(clientIp, urlId, userId);
                }
                // Return Cached URL
                return cachedUrl;
                
            }
            // --------------------------- URL is never shortened before --------------------------------
            const original_Url = await URLshortnerModel.getOriginalUrl(shortUrl);
            
            if (!original_Url) {
                throw new Error('ERROR URL not found');
            }

            if (userId && !URLshortnerMiddleware.checkPremission(original_Url.userId, userId)){
                throw new Error('Unauthorized User : you are not allowed to access this shortURL');
            }
            
            // Increment visit count
            const message = {message:`URL with id ${original_Url.id} was visited `,shortUrl:shortUrl};
            const publishMessage= await RedisMessageQueue.publishMessage(JSON.stringify(message));
            console.log('----------- publishMessage: --------- ')
            console.log(publishMessage);

            // Create access log
            if(clientIp){
                await URLshortnerMiddleware.createAccessLog(clientIp, original_Url.id, original_Url.userId);
            }

            // Cache the original URL
            await redisCache.setCache(shortUrl, original_Url.original_url, original_Url.id, original_Url.userId, original_Url.visitCount, original_Url.expirationDate);

            return original_Url;
        }
        catch (error) {
            logger.error(serviceName ,functionName, `Error getOriginalUrl: ${error.message}`);
            throw error;
        }
    }

    //Update a url record in db
    static async updateShortUrl(shortUrl, userId, data) {
        const functionName = 'updateShortUrl';
        try {

            if (data.originalUrl && !URLutils.isValidUrl(data.originalUrl)) {
                throw new Error('Invalid URL');

            }
            if (data.expirationDate && !URLutils.isValidExpirationDate(data.expirationDate)) {
                throw new Error('Invalid expiration date');
            }

            // Convert expiration date to Date object
            data.expirationDate = new Date(data.expirationDate);

            const original_Url = await URLshortnerModel.getOriginalUrl(shortUrl);
            if (!original_Url) {
                throw new Error('ERROR URL not found');
            }
            if (userId && !URLshortnerMiddleware.checkPremission(original_Url.userId, userId)){
                throw new Error('Unauthorized User : you are not allowed to access this shortURL');
            }

            // Update short URL
            const updatedURL = await URLshortnerModel.updateShortUrl(shortUrl, userId, data);
            if (!updatedURL) {
                throw new Error('Internal Server Error - Url data was not updated');
            }


            // Return updated short URL
            return updatedURL;
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
        }
    }


// delete a url record from db and cache

    static async deleteShortUrl(shortUrl, userId) {
        const functionName = 'deleteShortUrl';
        try {

            const original_Url = await URLshortnerModel.getOriginalUrl(shortUrl);
            console.log('original_Url',original_Url);
            if (!original_Url) {
                throw new Error('ERROR URL not found');
            }
            if (userId!==original_Url.userId) {
                throw new Error('Unauthorized User : you are not allowed to access this shortURL');
            }

            const urlId = original_Url.id;
            // Delete short URL from DB
            const deletedURL = await URLshortnerModel.deleteShortUrl(urlId, userId);
            if (!deletedURL) {
                throw new Error('Internal Server Error - Url was not deleted');
            }


            return deletedURL;
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
        }
    }


// delete expired urls from db and cache

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

// get all the urls for a user
    static async getURLs(userId) {
        const functionName = 'getURLs';
        try {
            const urls = await URLshortnerModel.getURLs(userId);
            return urls;
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
        }
    }


    
}

export default URLshortnerService;