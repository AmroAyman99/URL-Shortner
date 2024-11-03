import { PrismaClient } from '@prisma/client';
import logger from '../../../common/utils/logger/index.js';


const prisma = new PrismaClient()

const modelName = 'server.UsersModel.models.index';

class UsersModel {

    static async signUp(userData) {
        const functionName = 'signUp';
        try {
            const result = await prisma.user.create({
                data: {
                    userName: userData.username,
                    email: userData.email,
                    password: userData.password
                }
            });
            if (!result) {
                throw new Error('Internal Server Error - User was not created');    
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
    
    static async findUserWithPassword(user_name) {
        const functionName = 'findUserWithPassword';
        try {
            const user = await prisma.user.findUnique({
                where: {
                    userName: user_name
                }
            });
           return user;

        } catch(error) {
            logger.error(modelName, functionName, `Error: ${error.message}`);
            throw error; 
        } finally {
             //disconnect prisma
            await prisma.$disconnect()
            
        }
    }

    static async findUserById(user_id) {
        const functionName = 'findUserById';
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: user_id
                }
            });
           return user;

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
export default UsersModel;