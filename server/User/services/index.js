import UsersModel from '../models/index.js';
import logger from '../../../common/utils/logger/index.js';
import { comparePassword, encryptPassword } from '../../../common/utils/password/index.js';
import { generateToken } from '../../../common/utils/jwt/index.js';

const serviceName = 'server.users.services.index';

class UsersService {
    
    //login user
    static async login(username, password) {
        const functionName = 'login';
        try {
            const user = await UsersModel.findUserWithPassword(username); // find user by username
            console.log(`user: ${user} - username: ${username}`);
            if (!user) {
                throw new Error('Invalid username.');
            }
            const validPassword = await comparePassword(password, user.password);
            if (!validPassword) {
                throw new Error('Invalid username or password.');
            }
            const token = generateToken(user);
            //return token and role from user
            return { token };

        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);        }
            throw error;
    }

    //creates a new user
    static async signUp(data) {
        const functionName = 'signUp';
        try {
            // add validation for data
            if (!data.username || !data.password) {
                throw new Error('Username and password are required.');
            }
            // check if user already exists
            const username  = data.username;
            console.log(`username: ${username}`);
            const user = await UsersModel.findUserWithPassword( username);
            if (user) {
                console.log(`user: ${user} - username: ${username}`);
                throw new Error('Username already exists.');
            }
            // hash password
            data.password = await encryptPassword(data.password);
      
            return await UsersModel.signUp(data);
        } catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);        }
            throw error;
        }
    

    //get user by ID
    static async getUserById(userId) {
        const functionName = 'getUser';
        try {
            return await UsersModel.findUserById(userId);
        }
        catch (error) {
            logger.error(serviceName, functionName, `Error: ${error.message}`);        
            throw error;
        }
    }
    
    
}

export default UsersService;