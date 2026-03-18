import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed } from './entities/feed.entity';
import { FeedItemsQueryDto } from './dto/feed-items-query.dto';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a feed source' })
  async create(@Body() createFeedDto: CreateFeedDto): Promise<Feed> {
    return this.feedsService.create(createFeedDto);
  }

  @Get()
  @ApiOperation({ summary: 'List feeds' })
  async findAll(): Promise<Feed[]> {
    return this.feedsService.findAll();
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'List collected items for a specific feed' })
  async findFeedItemsByFeed(
    @Param('id') id: string,
    @Query() query: FeedItemsQueryDto,
  ) {
    const feed = await this.feedsService.findOne(id);
    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    return this.feedsService.findFeedItems({
      ...query,
      feedId: id,
    });
  }

  @Post(':id/collect')
  @ApiOperation({ summary: 'Enqueue collection for a specific feed' })
  async collectFeed(@Param('id') id: string) {
    return this.feedsService.enqueueCollectFeed(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single feed' })
  async findOne(@Param('id') id: string): Promise<Feed> {
    const feed = await this.feedsService.findOne(id);
    if (!feed) {
      throw new NotFoundException('Feed not found');
    }
    return feed;
  }

  @Post('collect')
  @ApiOperation({ summary: 'Enqueue collection for all active feeds' })
  async collectAllFeeds() {
    return this.feedsService.enqueueCollectAllFeeds();
  }
}

@ApiTags('feed-items')
@Controller('feed-items')
export class FeedItemsController {
  constructor(private feedsService: FeedsService) {}

  @Get()
  @ApiOperation({ summary: 'List collected feed items' })
  async findAllItems(@Query() query: FeedItemsQueryDto) {
    return this.feedsService.findFeedItems(query);
  }
}
