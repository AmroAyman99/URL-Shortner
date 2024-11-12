import { PrismaClient } from '@prisma/client';
import logger from '../../../common/utils/logger/index.js';
import redisCache from '../../../common/helpers/Redis/cach.js'; // Import the cache helper
import _ from 'lodash';
const prisma = new PrismaClient()

const modelName = 'server.URLshortner.models.index';

class URLshortnerModel{

    static async createShortUrl(originalUrl, shortUrl , expirationDate, user_Id) {
        const functionName = 'createShortUrl';
        try {
            await prisma.$connect();
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
            await prisma.$connect();
            const result = await prisma.url.findUnique({
                where: {
                    short_url: shortUrl
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
            await prisma.$connect();

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
            await prisma.$connect();
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

            await redisCache.incrementVisitCountInCache(shortUrl);

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


    //Update a url record in db
    static async updateShortUrl(shortUrl, user_Id, data) {
        const functionName = 'updateShortUrl';
        try {
            await prisma.$connect();
            const result = await prisma.url.update({
                where: {
                    short_url: shortUrl,
                    userId: user_Id
                },
                data: data
            });

            // Cache the updated short URL
            await redisCache.updateCache(result.short_url, result.original_url, result.id, result.userId, result.visitCount, result.expirationDate);

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



    //Delete expired URLs from the database and cache
    static async deleteExpiredUrls() {
        const functionName = 'deleteExpiredUrls';
        const currentDate = new Date();
        try {
            await prisma.$connect();
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
            
            //delete expired urls from access logs
            await prisma.accessLog.deleteMany({
                where: {
                    urlId: {
                        in: urlIds,
                    },
                },
            });

            // Delete the URL from the cache

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

    //Delete a URL record from the database 

    static async deleteShortUrl(urlId, user_Id) {
        const functionName = 'deleteShortUrl';
        try {
            console.log('shortUrl id IN MODEL ',urlId);
            await prisma.$connect();

            const Url = await prisma.url.findUnique({
                where: {
                    id: urlId
                }
            });
            
            console.log(`Deleting URL from cache: ${Url}`);
            if (_.isEmpty(Url)) {
                throw new Error('URL  is not found');
            }

            // Delete access logs
            await prisma.accessLog.deleteMany({
                where: {
                    urlId: Url.id,
                },
            });

            // Delete the URL from the database
            const result = await prisma.url.deleteMany({
                where: {
                    short_url: Url.short_url,
                    userId: user_Id
                }
            });
            // Delete the URL from the cache
            await redisCache.deleteCache(Url.short_url);

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


    //get all user URLs
    static async getURLs(user_Id) {
        const functionName = 'getURLs';
        try {
            await prisma.$connect();
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