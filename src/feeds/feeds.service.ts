import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import Parser from 'rss-parser';
import axios from 'axios';
import { Feed } from './entities/feed.entity';
import { FeedItem } from './entities/feed-item.entity';
import { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedsService {
  private readonly logger = new Logger(FeedsService.name);
  private parser = new Parser();

  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,
    @InjectRepository(FeedItem)
    private feedItemRepository: Repository<FeedItem>,
  ) {}

  async create(createFeedDto: CreateFeedDto): Promise<Feed> {
    const feed = this.feedRepository.create(createFeedDto);
    return this.feedRepository.save(feed);
  }

  async findAll(): Promise<Feed[]> {
    return this.feedRepository.find();
  }

  async findOne(id: string): Promise<Feed | null> {
    return this.feedRepository.findOne({ where: { id } });
  }

  @Cron('* * * * * *') // Every 10 minutes
  async collectFeeds() {
    this.logger.log('Starting feed collection...');
    const feeds = await this.feedRepository.find({ where: { isActive: true } });
    for (const feed of feeds) {
      try {
        await this.fetchAndParseFeed(feed);
      } catch (error) {
        this.logger.error(`Failed to collect feed ${feed.url}: ${(error as Error).message}`);
      }
    }
    this.logger.log('Feed collection completed.');
  }

  private async fetchAndParseFeed(feed: Feed) {
    const response = await axios.get(feed.url);
    const parsed = await this.parser.parseString(response.data);

    for (const item of parsed.items) {
      const existingItem = await this.feedItemRepository.findOne({
        where: { link: item.link, feedId: feed.id },
      });
      if (!existingItem) {
        const feedItem = this.feedItemRepository.create({
          title: item.title,
          description: item.contentSnippet || item.content,
          link: item.link,
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          content: item.content,
          feedId: feed.id,
        });
        await this.feedItemRepository.save(feedItem);
      }
    }
  }
}
