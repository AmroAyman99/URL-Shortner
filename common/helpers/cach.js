import { connectRedis } from '../config/redis.js'; 
import logger from '../utils/logger/index.js';
let client;

    (async () => {
      client = await connectRedis();
    })();

const serviceName = 'server.redisCache.Helper.index';


class redisCache {
  static async setCache(key, value, urlId,user_id, expiry = 3600) {
    try {
      const cacheValue = JSON.stringify({ value, urlId , user_id});
      await client.set(key, cacheValue, 'EX', expiry);
    } catch (error) {
      console.error(error);
    }
  }

  // getting value from cache
  static async getCache(key,userId) {
    const functionName = 'getCache';
    try {
      const cacheValue = await client.get(key);
      if (cacheValue) {
        const { value, urlId ,user_id } = JSON.parse(cacheValue);
        if (userId !== user_id) {
          throw new Error('Unauthorized User : you are not allowed to access this shortURL');
        }
        console.log('Cache hit', value, urlId);
        return { value, urlId ,user_id };
  
      } else {
        console.log('Cache miss');
        return null;
      }
    } catch (error) {
      logger.error(serviceName, functionName, `Error: ${error.message}`);
      throw error;

    }
  }

  static async deleteCache(key) {
    try {
      await client.del(key);
      logger.info(`Cache entry for key ${key} deleted`);
    } catch (error) {
      console.error(error);
    }
  }


}

// Export the class
export default redisCache;