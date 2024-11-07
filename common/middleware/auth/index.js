import _ from "lodash";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../../utils/errorResponse/index.js";
import ERROR_CODES from "../../constants/errorCodes.js"
import logger from "../../utils/logger/index.js";
import UsersService from "../../../server/User/services/index.js";

const serviceName = "middleware.auth";
const Auth = async (req, res, next) => {
    

    const functionName = `Auth`;
    logger.info(serviceName, functionName, `Checking if user is authenticated`);
    try {
        let token = req.headers["authorization"];

        logger.info(serviceName, functionName, `Token: ${token}`);
        if (!token){
            throw new ErrorResponse(
                ERROR_CODES.UNAUTHORIZED.message,
                StatusCodes.UNAUTHORIZED,
            );
        }
        if (!token.startsWith("Bearer "))
            throw new ErrorResponse(
                ERROR_CODES.INVALID_TOKEN.message,
                StatusCodes.BAD_REQUEST,
            );

        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        logger.info(serviceName, functionName, `Decoded token: ${JSON.stringify(decoded)}`);
        const userId = _.get(decoded, "userId", null);
        console.log('USER',userId);
        if (!decoded || !userId)
            throw new ErrorResponse(
                ERROR_CODES.INVALID_TOKEN.message,
                StatusCodes.BAD_REQUEST,
            );

        logger.info(serviceName, functionName, `User ${userId} is authenticated`);
        const user = await UsersService.getUserById(userId);

        if (!user)
            throw new ErrorResponse(
                ERROR_CODES.USER_NOT_FOUND.message,
                StatusCodes.BAD_REQUEST
            );

        delete user.password
        req.user = user
                             
        next();
    }
    catch (error) {
        logger.error(serviceName, functionName, `User is not authorized`);
        next(error)
    }
};

export default Auth;