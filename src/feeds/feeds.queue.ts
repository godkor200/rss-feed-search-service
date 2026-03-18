import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const FEEDS_QUEUE = 'FEEDS_QUEUE';
export const FEEDS_REDIS = 'FEEDS_REDIS';
export const FEEDS_QUEUE_NAME = 'feeds';

export const feedsQueueProviders: Provider[] = [
  {
    provide: FEEDS_REDIS,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new IORedis({
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: parseInt(configService.get<string>('REDIS_PORT', '6379'), 10),
        maxRetriesPerRequest: null,
      }),
  },
  {
    provide: FEEDS_QUEUE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new Queue(FEEDS_QUEUE_NAME, {
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: parseInt(configService.get<string>('REDIS_PORT', '6379'), 10),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 100,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      }),
  },
];

export interface CollectFeedJobData {
  feedId: string;
}

export interface CollectAllFeedsJobData {
  triggeredBy: 'api' | 'schedule';
}
