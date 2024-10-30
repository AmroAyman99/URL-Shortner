import express from 'express';
import URLshortnerRouter from './URLshortner/index.js';

const router = express.Router();

router.use(
   '/URLshortner', 
    URLshortnerRouter
);

export default router;