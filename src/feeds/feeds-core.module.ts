import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './entities/feed.entity';
import { FeedItem } from './entities/feed-item.entity';
import { feedsQueueProviders } from './feeds.queue';
import { FeedsService } from './feeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, FeedItem])],
  providers: [FeedsService, ...feedsQueueProviders],
  exports: [FeedsService, ...feedsQueueProviders],
})
export class FeedsCoreModule {}
