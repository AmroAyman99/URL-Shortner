import express from 'express';
import URLshortnerController from './controllers/index.js';
import Auth from '../../common/middleware/auth/index.js';
import Authorization from '../../common/middleware/authorization/index.js';

const router = express.Router();

router.get(
    '/getURLS/:shortURL',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.getOneURL
);

router.get(
    '/getURLs',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.getURLs
);

router.get(
    '/:shortURL',
    URLshortnerController.redirectURL
);

router.post(
    '/shorten',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.shortenURL
);

router.patch(
    '/updateURL/:shortURL',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.updateURL
);

router.delete(
    '/deleteURL/:shortURL',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.deleteURL
);










export default router;
