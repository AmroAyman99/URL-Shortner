import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { API_BASE_PATH } from './common/constants/index.js'; 
import cors from 'cors'
import logger from "./common/utils/logger/index.js";
import ErrorHandler from "./common/middleware/errorHandler/index.js";
import mainRouter from './server/index.js';
import cron from 'node-cron';
import URLshortnerService from './server/URLshortner/services/index.js';
import {connectDatabase} from './common/config/db.js';
const serviceName = 'URLshortner.index';

// Initialize the app
const app = express();
app.use(cors());

// Load environment variables
dotenv.config();


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Start the server
const PORT = process.env.PORT || 6000;

// Main Router
app.use(API_BASE_PATH, mainRouter, ErrorHandler());



app.set('trust proxy', true);

(async () => {
    await connectDatabase();
  
    app.listen(PORT, () => {
        logger.info(serviceName, 'app.listen', `Server is running on PORT ${PORT}`);
    });
  })();

// Schedule the cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    logger.info(serviceName, 'cron', 'Running daily cleanup of expired URLs');
    await URLshortnerService.deleteExpiredURLs();
});
