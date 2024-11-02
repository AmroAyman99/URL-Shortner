import { connectRedis } from '../config/redis.js'; 
let client;

(async () => {
  client = await connectRedis();
})();



class redisCache {
  static async setCache(key, value, urlId, expiry = 3600) {
    try {
      const cacheValue = JSON.stringify({ value, urlId });
      await client.set(key, cacheValue, 'EX', expiry);
    } catch (error) {
      console.error(error);
    }
  }

  // getting value from cache
  static async getCache(key) {
    try {
      const cacheValue = await client.get(key);
      if (cacheValue) {
        const { value, urlId } = JSON.parse(cacheValue);
        console.log('Cache hit', value, urlId);
        return { value, urlId };
      } else {
        console.log('Cache miss');
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }


}

// Export the class
export default redisCache;