import { PrismaClient } from '@prisma/client';
import logger from '../../../common/utils/logger/index.js';


const prisma = new PrismaClient()

const modelName = 'server.AccessLog.models.index';

class AccessLogModel{

    static async createAccessLog(clientIp, url_Id, user_Id) {
        const functionName = 'createAccessLog';
        try {
            prisma.$connect();

            // Create access log
            const result = await prisma.accessLog.create({
                data: {
                    IPaddress: clientIp,
                    urlId: url_Id,
                    userId: user_Id
                }
            });
            return result;

        } catch(error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error; 
        } finally {
             //disconnect prisma
            await prisma.$disconnect()
            
        }
    }

 
}

// Export the class
export default AccessLogModel;