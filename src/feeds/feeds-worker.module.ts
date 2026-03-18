import { Module } from '@nestjs/common';
import { FeedsCoreModule } from './feeds-core.module';
import { FeedsWorkerService } from './feeds.worker';

@Module({
  imports: [FeedsCoreModule],
  providers: [FeedsWorkerService],
})
export class FeedsWorkerModule {}
