import { createClient } from 'redis';

export async function connectRedis() {
  const client = createClient({
    url: 'redis://default:TDNFBzXRcforb1WF3e0auXcvkVhOytdV@redis-10887.c246.us-east-1-4.ec2.redns.redis-cloud.com:10887'
  });

  client.on('error', err => console.log('Redis Client Error', err));

  await client.connect();
  console.log('Connected to Redis Cloud');
  return client;

}
