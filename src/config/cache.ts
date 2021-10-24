import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: string;
  config: {
    redis: RedisOptions;
  };
}

export const cacheConfig = {
  driver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || undefined,
    },
  },
} as ICacheConfig;
