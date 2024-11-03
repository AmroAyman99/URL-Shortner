import express from 'express';
import UsersController from './controllers/index.js';

const router = express.Router();

//Login user
router.post(
    '/login',
    UsersController.login,
);

//Create user (Admin only)
router.post(
    '/create',
    UsersController.signUp,
);

export default router;