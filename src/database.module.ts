import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feeds/entities/feed.entity';
import { FeedItem } from './feeds/entities/feed-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'postgres'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'rss_user'),
        password: configService.get<string>('DB_PASSWORD', 'rss_password'),
        database: configService.get<string>('DB_NAME', 'rss_db'),
        entities: [Feed, FeedItem],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
