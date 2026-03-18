import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FeedsCoreModule } from './feeds-core.module';
import { FeedItemsController, FeedsController } from './feeds.controller';
import { FeedsSchedulerService } from './feeds-scheduler.service';

@Module({
  imports: [FeedsCoreModule, ScheduleModule.forRoot()],
  providers: [FeedsSchedulerService],
  controllers: [FeedsController, FeedItemsController],
})
export class FeedsApiModule {}
