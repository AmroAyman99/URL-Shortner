import { connectRedis } from '../config/redis.js'; 
let client;

(async () => {
  client = await connectRedis();
})();



class redisCache {
  static async setCache(key, value, expiry = 3600) {
    try {
      await client.set(key, value, 'EX', expiry);
    } catch (error) {
      console.error(error);
    }
  }

  // getting value from cache
  static async getCache(key) {
    try {
      const value = await client.get(key);
      value ? console.log('Cache hit', value) : console.log('Cache miss');
      return value;
    } catch (error) {
      console.error(error);
    }
  }
}

// Export the class
export default redisCache;