import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedsService } from './feeds.service';

@Injectable()
export class FeedsSchedulerService {
  constructor(private readonly feedsService: FeedsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async collectFeedsOnSchedule() {
    await this.feedsService.enqueueCollectAllFeeds('schedule');
  }
}
