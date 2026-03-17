import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Feed } from './entities/feed.entity';
import { FeedItem } from './entities/feed-item.entity';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed, FeedItem]),
    ScheduleModule.forRoot(),
  ],
  providers: [FeedsService],
  controllers: [FeedsController],
})
export class FeedsModule {}
