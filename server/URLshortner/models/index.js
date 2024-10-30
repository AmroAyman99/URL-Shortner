import { pool } from '../../../common/config/db.js';
import { PrismaClient } from '@prisma/client';
import logger from '../../../common/utils/logger/index.js';

const prisma = new PrismaClient()

const modelName = 'server.URLshortner.models.index';

class URLshortnerModel{

    static async createShortUrl(originalUrl, shortUrl) {
        const functionName = 'createShortUrl';
        try {
            const result = await prisma.url.create({
                data: {
                    original_url: originalUrl,
                    short_url: shortUrl
                }
            });
            if (!result) {
                throw new Error('Internal Server Error - shortUrl was not created');    
            }
            return result;

        } catch(error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error; 
        } finally {
             //disconnect prisma
            await prisma.$disconnect()
            
        }
    }
    static async getOriginalUrl(shortUrl) {
        const functionName = 'getOriginalUrl';
        try {
            const result = await prisma.url.findUnique({
                where: {
                    short_url: shortUrl
                }
            });
            if (!result) {
                throw new Error('Internal Server Error - No URL found');    
            }
            return result ? result.original_url : null;
        }catch(error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error;
        }
         finally {
            // Disconnect Prisma
            await prisma.$disconnect();
        }
    }
}

// Export the class
export default URLshortnerModel;