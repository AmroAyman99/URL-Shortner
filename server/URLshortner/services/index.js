import URLshortnerModel from '../models/index.js';
import logger from '../../../common/utils/logger/index.js';
import URLutils from '../../../common/utils/urlUtils/index.js';


const serviceName = 'server.URLshortner.services.index';
class URLshortnerService{
    static async createShortUrl(originalUrl) {
        const functionName = 'createShortUrl';
        try {

            if (!URLutils.isValidUrl(originalUrl)) {
                throw new Error('Invalid URL');

            }
            const shortUrl = URLutils.generateShortUrl();
            
            if (!shortUrl) {
                throw new Error('Internal Server Error  shortUrl');
                
            }
            const URLshorted = await URLshortnerModel.createShortUrl(originalUrl, shortUrl);
            if (!URLshorted) {
                throw new Error('Internal Server Error');
            }
            return shortUrl;
             
          
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
    
        }
    }

    static async getOriginalUrl(shortUrl) {
        const functionName = 'getOriginalUrl';
        try {
            
            const originalUrl = await URLshortnerModel.getOriginalUrl(shortUrl);
            console.log('originalUrl in service : -------------    ', originalUrl);
            if (!originalUrl) {
                throw new Error('URL not found');
            }
            return originalUrl;
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);
            throw error;
        }
    }

    
}

export default URLshortnerService;