import { PrismaClient } from '@prisma/client';
import logger from '../../../common/utils/logger/index.js';


const prisma = new PrismaClient()

const modelName = 'server.URLshortner.models.index';

class URLshortnerModel{

    static async createShortUrl(originalUrl, shortUrl , expirationDate, user_Id) {
        const functionName = 'createShortUrl';
        try {
            const result = await prisma.url.create({
                data: {
                    original_url: originalUrl,
                    short_url: shortUrl,
                    expirationDate: expirationDate,
                    visitCount: 0,
                    userId: user_Id
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

    static async getShortUrl(originalUrl,user_Id) {
        const functionName = 'getShortUrl';
        try {
            //get short url from db where original url and user id matches

            const result = await prisma.url.findFirst({
                where: {
                    original_url: originalUrl,
                    userId: user_Id
                }
            });

          
            return result ? result : null;
        }catch(error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error;
        }
         finally {
            // Disconnect Prisma
            await prisma.$disconnect();
        }
    }

    //Increment the visit count for the URL 
    static async incrementVisitCount(shortUrl) {
        const functionName = 'incrementVisitCount';
        try {
            const result = await prisma.url.update({
                where: {
                    short_url: shortUrl
                },
                data: {
                    visitCount: {
                        increment: 1
                    }
                }
            });
            return result ? result.visitCount : null;
        }catch(error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error;
        }
         finally {
            // Disconnect Prisma
            await prisma.$disconnect();
        }
    }

    static async deleteExpiredUrls() {
        const currentDate = new Date();
        try {
            const result = await prisma.url.deleteMany({
                where: {
                    expirationDate: {
                        lte: currentDate,
                    },
                },
            });
            console.log(`Deleted ${result.count} expired URLs`);
            
            return result ? result.count : null;

        } catch (error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error;
        } finally {
            // Disconnect Prisma
            await prisma.$disconnect();
        }
    }
}
// Export the class
export default URLshortnerModel;