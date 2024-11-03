import _ from 'lodash';
import UsersService from '../services/index.js';
import statusCodes from 'http-status-codes';

class UsersController {
     //User login
     static async login(req, res) {
        try {
            const { username, password } = _.get(req, 'body', null);
          
            const token = await UsersService.login(username, password);

            res.status(statusCodes.OK).json({ token: token });
        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //creates a new user 
    static async signUp(req, res) {
        try {
            const data = _.get(req, 'body', null);
            // log the data
            console.log('Received data for sign up:', data);
            console.log(` username: ${data.username}`);
            const user = await UsersService.signUp(data);
            res.status(statusCodes.CREATED).json({ user: user });

        } catch (error) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    
}
export default UsersController;