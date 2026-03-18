import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedType } from '../entities/feed.entity';

export class CreateFeedDto {
  @ApiProperty({ example: 'BBC News' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'https://feeds.bbci.co.uk/news/rss.xml' })
  @IsString()
  url!: string;

  @ApiProperty({ enum: FeedType, example: FeedType.NEWS })
  @IsEnum(FeedType)
  type!: FeedType;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
