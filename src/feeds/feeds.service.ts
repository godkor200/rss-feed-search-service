import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import Parser from 'rss-parser';
import axios from 'axios';
import { Queue } from 'bullmq';
import { Feed } from './entities/feed.entity';
import { FeedItem } from './entities/feed-item.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FeedItemsQueryDto } from './dto/feed-items-query.dto';
import { FEEDS_QUEUE } from './feeds.queue';

interface FeedCollectionResult {
  feedId: string;
  feedName: string;
  fetchedCount: number;
  insertedCount: number;
  skippedCount: number;
}

interface FeedCollectionSummary {
  totalFeeds: number;
  successCount: number;
  failureCount: number;
  results: FeedCollectionResult[];
  failedFeeds: Array<{ feedId: string; url: string; reason: string }>;
}

interface QueueJobResult {
  status: 'queued';
  jobId: string;
  jobName: string;
}

@Injectable()
export class FeedsService {
  private readonly logger = new Logger(FeedsService.name);
  private parser = new Parser();

  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,
    @InjectRepository(FeedItem)
    private feedItemRepository: Repository<FeedItem>,
    @Inject(FEEDS_QUEUE)
    private readonly feedsQueue: Queue,
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

  async findFeedItems(query: FeedItemsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const queryBuilder = this.feedItemRepository
      .createQueryBuilder('feedItem')
      .leftJoinAndSelect('feedItem.feed', 'feed')
      .orderBy('feedItem.pubDate', 'DESC')
      .addOrderBy('feedItem.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.feedId) {
      queryBuilder.andWhere('feedItem.feedId = :feedId', { feedId: query.feedId });
    }

    if (query.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('feedItem.title ILIKE :search', { search: `%${query.search}%` }).orWhere(
            'feedItem.description ILIKE :search',
            { search: `%${query.search}%` },
          );
        }),
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async enqueueCollectAllFeeds(triggeredBy: 'api' | 'schedule' = 'api'): Promise<QueueJobResult> {
    const job = await this.feedsQueue.add('collect-all-feeds', {
      triggeredBy,
    });

    return {
      status: 'queued',
      jobId: String(job.id),
      jobName: job.name,
    };
  }

  async enqueueCollectFeed(id: string): Promise<QueueJobResult> {
    const feed = await this.feedRepository.findOne({ where: { id } });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    const job = await this.feedsQueue.add(
      'collect-feed',
      { feedId: id },
      {
        jobId: `collect-feed:${id}`,
      },
    );

    return {
      status: 'queued',
      jobId: String(job.id),
      jobName: job.name,
    };
  }

  async processCollectAllFeeds(): Promise<FeedCollectionSummary> {
    this.logger.log('Starting feed collection...');
    const feeds = await this.feedRepository.find({ where: { isActive: true } });
    const results: FeedCollectionResult[] = [];
    const failedFeeds: Array<{ feedId: string; url: string; reason: string }> = [];

    for (const feed of feeds) {
      try {
        const result = await this.fetchAndParseFeed(feed);
        results.push(result);
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Unknown error';

        this.logger.error(`Failed to collect feed ${feed.url}: ${reason}`);
        failedFeeds.push({
          feedId: feed.id,
          url: feed.url,
          reason,
        });
      }
    }

    this.logger.log('Feed collection completed.');

    return {
      totalFeeds: feeds.length,
      successCount: results.length,
      failureCount: failedFeeds.length,
      results,
      failedFeeds,
    };
  }

  async processCollectFeed(id: string): Promise<FeedCollectionResult> {
    const feed = await this.feedRepository.findOne({ where: { id } });

    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    return this.fetchAndParseFeed(feed);
  }

  private async fetchAndParseFeed(feed: Feed): Promise<FeedCollectionResult> {
    const response = await axios.get(feed.url, {
      timeout: 10000,
      responseType: 'text',
    });
    const parsed = await this.parser.parseString(response.data);
    const candidates = parsed.items
      .map((item) => {
        const link = item.link?.trim() || item.guid?.trim();

        if (!link) {
          return null;
        }

        return {
          title: item.title?.trim() || 'Untitled feed item',
          description: item.contentSnippet?.trim() || item.content?.trim() || null,
          link,
          pubDate: this.parsePubDate(item.pubDate),
          content: item.content?.trim() || null,
          feedId: feed.id,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (candidates.length === 0) {
      return {
        feedId: feed.id,
        feedName: feed.name,
        fetchedCount: 0,
        insertedCount: 0,
        skippedCount: 0,
      };
    }

    const uniqueCandidates = Array.from(new Map(candidates.map((item) => [item.link, item])).values());
    const existingItems = await this.feedItemRepository.find({
      select: ['link'],
      where: {
        feedId: feed.id,
      },
    });
    const existingLinks = new Set(existingItems.map((item) => item.link));
    const newItems = uniqueCandidates.filter((item) => !existingLinks.has(item.link));

    if (newItems.length > 0) {
      await this.feedItemRepository.save(this.feedItemRepository.create(newItems));
    }

    return {
      feedId: feed.id,
      feedName: feed.name,
      fetchedCount: uniqueCandidates.length,
      insertedCount: newItems.length,
      skippedCount: uniqueCandidates.length - newItems.length,
    };
  }

  private parsePubDate(value?: string): Date | null {
    if (!value) {
      return null;
    }

    const parsedDate = new Date(value);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
}
