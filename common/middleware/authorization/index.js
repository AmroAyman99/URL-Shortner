import _ from "lodash";
import logger from "../../utils/logger/index.js";
import ErrorResponse from "../../utils/errorResponse/index.js";
import { StatusCodes } from "http-status-codes";
import ErrorCodes from "../../constants/errorCodes.js";



const serviceName = "common.middleware.authorization.index";
export default class Authorization {

    static isAuthorizedResource(permissions, userRole) {

        if (permissions.includes(userRole)) {
            return true;
        }
        return false;
    }

    static Authorize = (permissions) => {
        return (req, res, next) => {
            const functionName = `Authorize`;
            const { user } = req;

            // const role = _.get(req, 'user.role', null);

            if (!user) {
                logger.error(serviceName, functionName, `User is not authorized`);
                throw new ErrorResponse(
                    ErrorCodes.UNAUTHORIZED.message,
                    StatusCodes.UNAUTHORIZED,
                );
            }

            // if (permissions) {
            //     const isAuthorized = this.isAuthorizedResource(permissions, role);
            //     if (!isAuthorized) {
            //         throw new ErrorResponse(
            //             ErrorCodes.UNAUTHORIZED.message,
            //             StatusCodes.UNAUTHORIZED,
            //         );
            //     }
            // }
            next();
        };
    }
}