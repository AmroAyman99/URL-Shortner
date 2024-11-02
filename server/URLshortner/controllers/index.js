import _ from 'lodash';
import URLshortnerService from '../services/index.js';
import statusCodes from 'http-status-codes';

class URLshortnerController {
    static async shortenURL(req, res) {
        try {
            const  originalUrl  = req.body.originalUrl;
            const  expirationDate  = req.body.expirationDate;
            const clientIp = req.ip;

            console.log("original URL in controller ",originalUrl);
            if (_.isEmpty(originalUrl)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Original URL is required' });
            }
              // Set default expiration date to 30 days from now if not provided
              let expiryDate = expirationDate;
              if (_.isEmpty(expirationDate)) {
                  const currentDate = new Date();
                  expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
              }
             
              const shortUrl = await URLshortnerService.createShortUrl(originalUrl, expiryDate, clientIp,);
              return res.status(statusCodes.OK).json({ shortUrl: shortUrl });
        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async redirectURL(req, res) {
        try {
            const  shortUrl = req.params.shortURL;
            const clientIp = req.ip;
            if (_.isEmpty(shortUrl)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Short URL is required' });
            }
            const originalUrl = await URLshortnerService.getOriginalUrl(shortUrl, clientIp);
            if (_.isEmpty(originalUrl)) {
                return res.status(statusCodes.NOT_FOUND).json({ error: 'URL not found' });
            }
            return res.redirect(originalUrl);
        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }


    
}
export default URLshortnerController;