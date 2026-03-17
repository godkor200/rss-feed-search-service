import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed } from './entities/feed.entity';

@Controller('feeds')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Post()
  async create(@Body() createFeedDto: CreateFeedDto): Promise<Feed> {
    return this.feedsService.create(createFeedDto);
  }

  @Get()
  async findAll(): Promise<Feed[]> {
    return this.feedsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Feed> {
    const feed = await this.feedsService.findOne(id);
    if (!feed) {
      throw new NotFoundException('Feed not found');
    }
    return feed;
  }
}
