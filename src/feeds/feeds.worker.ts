import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { FeedsService } from './feeds.service';
import {
  CollectAllFeedsJobData,
  CollectFeedJobData,
  FEEDS_QUEUE_NAME,
  FEEDS_REDIS,
} from './feeds.queue';

@Injectable()
export class FeedsWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FeedsWorkerService.name);
  private worker: Worker | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly feedsService: FeedsService,
    @Inject(FEEDS_REDIS) private readonly redis: IORedis,
  ) {}

  async onModuleInit() {
    if (this.configService.get<string>('APP_ROLE', 'api') !== 'worker') {
      return;
    }

    this.worker = new Worker(
      FEEDS_QUEUE_NAME,
      async (job: Job<CollectFeedJobData | CollectAllFeedsJobData>) => {
        if (job.name === 'collect-feed') {
          const { feedId } = job.data as CollectFeedJobData;
          return this.feedsService.processCollectFeed(feedId);
        }

        if (job.name === 'collect-all-feeds') {
          return this.feedsService.processCollectAllFeeds();
        }

        throw new Error(`Unsupported job type: ${job.name}`);
      },
      {
        connection: this.redis,
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Completed job ${job.name} (${job.id})`);
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error(`Failed job ${job?.name ?? 'unknown'} (${job?.id ?? 'n/a'}): ${error.message}`);
    });

    this.logger.log('Feeds worker started.');
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
  }
}
