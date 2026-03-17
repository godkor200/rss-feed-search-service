import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Feed } from './feeds/entities/feed.entity';
import { FeedItem } from './feeds/entities/feed-item.entity';
import { FeedsModule } from './feeds/feeds.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'rss_user',
      password: process.env.DB_PASSWORD || 'rss_password',
      database: process.env.DB_NAME || 'rss_db',
      entities: [Feed, FeedItem],
      synchronize: true,
    }),
    FeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
