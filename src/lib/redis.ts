import { Redis } from 'ioredis';

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Handle Redis connection events
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

// Cache utility functions
export async function getCachedData(key: string) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
}

export async function setCachedData(key: string, data: any, ttlSeconds: number = 1800) {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error setting cached data:', error);
    return false;
  }
}

export async function deleteCachedData(key: string) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting cached data:', error);
    return false;
  }
}

export async function clearAllCache() {
  try {
    await redis.flushall();
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

export default redis; 