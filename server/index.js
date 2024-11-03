import express from 'express';
import URLshortnerRouter from './URLshortner/index.js';
import UserRouter from './User/index.js';
const router = express.Router();

router.use(
   '/URLshortner', 
    URLshortnerRouter
);

router.use(
    '/Users',
    UserRouter
);

export default router;