import { connectRedis } from '../../config/redis.js'; 
import logger from '../../utils/logger/index.js';


const serviceName = 'server.redisMessageQueue.Helper.index';

class RedisMessageQueue {
  static client = connectRedis();

    static async publishMessage(message) {
        const functionName = 'publishMessage';
        try {
          
          const result = await (await this.client).LPUSH('messageQueue', message);
          return result;
        } catch (error) {
          logger.error(serviceName, functionName, `Error: ${error.message}`);
          return null;
        }
      }

    static async popMessage() {
      const functionName = 'popMessage';
    try {
        const queueLength = await (await this.client).LLEN('messageQueue');
        if (queueLength === 0) {
          throw new Error('Queue is empty');
        }
        const message = await (await this.client).rPop('messageQueue');
        return message;
      } catch (error) {
          logger.error(serviceName, functionName, `Error: ${error.message}`);
          return null;
      }
    }
}

export default RedisMessageQueue;
