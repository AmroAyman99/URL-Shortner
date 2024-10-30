import express from 'express';
import URLshortnerController from './controllers/index.js';

const router = express.Router();

router.post(
    '/shorten',
    URLshortnerController.shortenURL
);

router.get(
    '/:shortURL',
    URLshortnerController.redirectURL
);

export default router;