import express from 'express';
import URLshortnerController from './controllers/index.js';
import Auth from '../../common/middleware/auth/index.js';
import Authorization from '../../common/middleware/authorization/index.js';

const router = express.Router();

router.post(
    '/shorten',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.shortenURL
);

router.get(
    '/:shortURL',
    Auth,
    Authorization.Authorize(),
    URLshortnerController.redirectURL
);

export default router;