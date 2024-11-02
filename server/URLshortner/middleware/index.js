import AccessLogModel from '../models/accessLog.js';
import logger from '../../../common/utils/logger/index.js';

const serviceName = 'server.URLshortner.middleware.index';

class URLshortnerMiddleware {
    static async createAccessLog(clientIp, urlId) {
        const functionName = 'createAccessLog';
        const AccessLog = await AccessLogModel.createAccessLog(clientIp, urlId);
                if (!AccessLog) {
                    //throw a warning
                    logger.warn(serviceName, functionName, `Access Log was not created`);
                }
                else{
                    logger.info(serviceName, functionName, `Access Log is created: Access Time: ${AccessLog.AccessTime}`+
                        `   IP Address: ${AccessLog.IPaddress}`);
                }
            }
}

export default URLshortnerMiddleware;
