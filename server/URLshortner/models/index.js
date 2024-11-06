import { PrismaClient } from '@prisma/client';
import logger from '../../../common/utils/logger/index.js';
import redisCache from '../../../common/helpers/cach.js'; // Import the cache helper

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
    
    static async getOriginalUrl(shortUrl, user_Id) {
        const functionName = 'getOriginalUrl';
        try {
            const result = await prisma.url.findUnique({
                where: {
                    short_url: shortUrl,
                    userId: user_Id
                }
            });
            console.log("result in getOriginalUrl ----------",result);
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

    //Delete expired URLs from the database and cache
    static async deleteExpiredUrls() {
        const functionName = 'deleteExpiredUrls';
        const currentDate = new Date();
        try {

             // Fetch expired URLs before deletion
             const expiredUrls = await prisma.url.findMany({
                where: {
                    expirationDate: {
                        lte: currentDate,
                    },
                },
                select: {
                    id: true,
                    short_url: true,
                },
            });

            // Delete related access logs
            const urlIds = expiredUrls.map(url => url.id);
            await prisma.accessLog.deleteMany({
                where: {
                    urlId: {
                        in: urlIds,
                    },
                },
            });
            
            // Delete expired URLs from the database            
            const result = await prisma.url.deleteMany({
                where: {
                    id: {
                        in: urlIds,
                    },
                },
            });

            console.log(`Deleted ${result.count} expired URLs`);

            for (const url of expiredUrls) {
                await redisCache.deleteCache(url.short_url);
            }
            return result ? result.count : null;

        } catch (error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error;
        } finally {
            // Disconnect Prisma
            await prisma.$disconnect();
        }
    }

    //get all user URLs
    static async getURLs(user_Id) {
        const functionName = 'getURLs';
        try {
            const result = await prisma.url.findMany({
                where: {
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

}
// Export the class
export default URLshortnerModel;