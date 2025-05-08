import Redis from 'ioredis';

let redis: Redis | null = null;
let isRedisAvailable = true;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  });
  redis.on('error', (err) => {
    isRedisAvailable = false;
    console.warn('[Redis] Connection failed, using in-memory cache:', err.message);
  });
} catch (err) {
  isRedisAvailable = false;
  console.warn('[Redis] Initialization failed, using in-memory cache:', err instanceof Error ? err.message : err);
}

// Simple in-memory fallback cache
const memoryCache = new Map<string, { value: string; expires: number }>();
const CACHE_TTL = 3600; // 1 hour

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  if (isRedisAvailable && redis) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
    }
  }
  // Fallback: in-memory
  const entry = memoryCache.get(key);
  if (entry && entry.expires > Date.now()) {
    return JSON.parse(entry.value);
  }
  return null;
};

export const setCachedData = async <T>(key: string, data: T, ttl: number = CACHE_TTL): Promise<void> => {
  if (isRedisAvailable && redis) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      return;
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  // Fallback: in-memory
  memoryCache.set(key, { value: JSON.stringify(data), expires: Date.now() + ttl * 1000 });
};

export const deleteCachedData = async (key: string): Promise<void> => {
  if (isRedisAvailable && redis) {
    try {
      await redis.del(key);
      return;
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }
  // Fallback: in-memory
  memoryCache.delete(key);
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  if (isRedisAvailable && redis) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return;
    } catch (error) {
      console.error('Redis invalidate error:', error);
    }
  }
  // Fallback: in-memory
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern.replace(/[*]/g, ''))) {
      memoryCache.delete(key);
    }
  }
};

export default redis; 