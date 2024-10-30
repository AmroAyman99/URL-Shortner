import _ from 'lodash';
import URLshortnerService from '../services/index.js';
import statusCodes from 'http-status-codes';

class URLshortnerController {
    static async shortenURL(req, res) {
        try {
            const { originalUrl } = req.body;
            if (_.isEmpty(originalUrl)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Original URL is required' });
            }
            const shortUrl = await URLshortnerService.createShortUrl(originalUrl);
            return res.status(statusCodes.OK).json({ shortUrl: shortUrl });
        } catch (error) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async redirectURL(req, res) {
        try {
            const  shortUrl = req.params.shortURL;
            console.log('shortUrl : -------------    ', shortUrl);
            if (_.isEmpty(shortUrl)) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: 'Short URL is required' });
            }
            const originalUrl = await URLshortnerService.getOriginalUrl(shortUrl);
            console.log('originalUrl in controller : -------------    ', originalUrl);
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