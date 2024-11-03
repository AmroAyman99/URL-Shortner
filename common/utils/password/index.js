import bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS } from '../../constants/index.js';

import logger from '../logger/index.js';

const serviceName = 'utils.password';

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hash) => {
    const functionName = `comparePassword`;
    try{
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        logger.error(serviceName, functionName, `Error while comparing password:  ${error}`);
        return false;
    }
}

const passwordRegexesByStricteness = {
    LOW: /^(?=.{6,})/, // password should be at least 6 characters long
    MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/, // password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number
    HIGH: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.{8,})/ // password should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character
}

export const isValidPassword = (password) => {
    const functionName = `validatePassword`;
    try {
        const passwordRegex = passwordRegexesByStricteness.LOW;

        return passwordRegex.test(password);
    } catch (error) {
        logger.error(serviceName, functionName, `Error while validating password:  ${error}`);
        return false;
    }
}

