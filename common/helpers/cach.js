import { connectRedis } from '../config/redis.js'; 
import logger from '../utils/logger/index.js';
let client;

    (async () => {
      client = await connectRedis();
    })();

const serviceName = 'server.redisCache.Helper.index';


class redisCache {
  // setting key and values in cache
  static async setCache(key, value, urlId,user_id, visitCount, expirationDate, expiry = 3600) {
    const functionName = 'setCache';
    try {
      const cacheValue = JSON.stringify({ value, urlId , user_id, visitCount, expirationDate });
      await client.set(key, cacheValue, 'EX', expiry);
    } catch (error) {
      logger.error(serviceName, functionName, `Error: ${error.message}`);

    }
  }

  // getting value from cache
  static async getCache(key,userId) {
    const functionName = 'getCache';
    try {
      const cacheValue = await client.get(key);
      if (cacheValue) {
        const { value, urlId ,user_id , visitCount, expirationDate } = JSON.parse(cacheValue);
        console.log('Cache hit', value, urlId);
        return { value, urlId ,user_id, visitCount, expirationDate  };
  
      } else {
        console.log('Cache miss');
        return null;
      }
    } catch (error) {
      logger.error(serviceName, functionName, `Error: ${error.message}`);
      throw error;

    }
  }

  // delete a record from cache
  static async deleteCache(key) {
    const functionName = 'deleteCache';
    try {
      await client.del(key);
      logger.info(`Cache entry for key ${key} deleted`);
    } catch (error) {
      logger.error(serviceName, functionName, `Error: ${error.message}`);

    }
  }

  //incremet  visit count in cache
  static async incrementVisitCountInCache(key) {
    const functionName = 'incrementVisitCountInCache';
    try {
      const cacheValue = await client.get(key);
      if (cacheValue) {
        const { value, urlId , user_id, visitCount, expirationDate } = JSON.parse(cacheValue);
        await client.set(key, JSON.stringify({ value, urlId , user_id, visitCount: visitCount + 1, expirationDate }));
      }
    } catch (error) {
      logger.error(serviceName, functionName, `Error: ${error.message}`);

    }
  }

  //update a record in cache
  static async updateCache(key, value, urlId, user_id, visitCount, expirationDate) {
    const functionName = 'updateCache';
    try {
      const cacheValue = await client.get(key);
      if (cacheValue) {
        await client.set(key, JSON.stringify({ value, urlId , user_id, visitCount, expirationDate }));
      }
    } catch (error) {
      logger.error(serviceName, functionName, `Error: ${error.message}`);

    }
  }
  


}

// Export the class
export default redisCache;