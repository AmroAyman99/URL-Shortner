import _ from 'lodash';
import URLshortnerService from '../services/index.js';
import statusCodes from 'http-status-codes';
import logger from '../../../common/utils/logger/index.js';

class URLshortnerController {
    static async shortenURL(req, res) {
        try {
            const DOCKER_ENV = process.env.DOCKER_ENV || 'UNDEFINED';
            logger.info("DOCKER_ENV:       -------- ", DOCKER_ENV);
            const  originalUrl  = req.body.originalUrl;
            const  expirationDate  = req.body.expirationDate;
            const userId = req.user.id;
            if(!userId){
                return res.status(statusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }
            logger.info("User id Authoruzed:       -------- ",userId);
            if (_.isEmpty(originalUrl)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Original URL is required' });
            }
              // Set default expiration date to 30 days from now if not provided
              let expiryDate = expirationDate;
              if (_.isEmpty(expirationDate)) {
                  const currentDate = new Date();
                  expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
              }
             
              const shortUrl = await URLshortnerService.createShortUrl(originalUrl, expiryDate, userId);
              return res.status(statusCodes.OK).json({ shortUrl: shortUrl, DOCKER_ENV: DOCKER_ENV });
        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async redirectURL(req, res) {
        try {
            logger.info("-------------------redirectURL---------------------------------------------");
            const  shortUrl = req.params.shortURL;
            const clientIp = req.ip;
        
            logger.info('shortUrl :      ', shortUrl);
            if (!shortUrl) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Short URL is required' });
            }
            const originalUrl = await URLshortnerService.getOriginalUrl(shortUrl, null, clientIp);
            if (_.isEmpty(originalUrl)) {
                return res.status(statusCodes.NOT_FOUND).json({ error: 'URL not found' });
            }

            if(originalUrl.original_url) {
                return res.status(statusCodes.OK).redirect(originalUrl.original_url);
            }

            if(originalUrl.value) {
                return res.status(statusCodes.OK).redirect(originalUrl.value);
            }
            
            
           

            

        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    
    //get all the urls
    static async getURLs(req, res) {
        try {
            const userId = req.user.id;
            if(!userId){
                return res.status(statusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }

            const urls = await URLshortnerService.getURLs(userId);
            return res.status(statusCodes.OK).json({ urls: urls });
        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //get one url
    static async getOneURL(req, res) {
        try {
            //check if user is authorized
            const userId = req.user.id;
            if(!userId){
                logger.info('User id :       -------- ',userId);
                return res.status(statusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }
            //get the short url from the request params
            const shortUrl = req.params.shortURL;
            if (_.isEmpty(shortUrl)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Short URL is required' });
            }

            const urlData = await URLshortnerService.getOriginalUrl(shortUrl, userId);
            if (_.isEmpty(urlData)) {
                return res.status(statusCodes.NOT_FOUND).json({ error: 'URL not found' });
            }
            return res.status(statusCodes.OK).json({ urlData: urlData });
            
        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //update  url details
    static async updateURL(req, res) {
        try {
            const userId = req.user.id;
            const  shortUrl = req.params.shortURL;
            const data = req.body;

            if(!userId){
                return res.status(statusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }
            
            if (_.isEmpty(data)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Data is required' });
            }

            if (!shortUrl) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Short URL is required' });
            }

            const updatedUrl = await URLshortnerService.updateShortUrl(shortUrl,userId, data);
            res.status(statusCodes.OK).json({ updatedUrl: updatedUrl });

        } catch (error) {

            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async deleteURL(req, res) {
        try {
            const userId = req.user.id;
            const  shortUrl = req.params.shortURL;

            if(!userId){
                return res.status(statusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
            }
            if (!shortUrl) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Short URL is required' });
            }

            const deletedURL = await URLshortnerService.deleteShortUrl(shortUrl, userId);
            res.status(statusCodes.OK).json({ deletedURL: deletedURL });

        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    
}
export default URLshortnerController;