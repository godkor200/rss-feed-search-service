import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { FeedType } from '../entities/feed.entity';

export class CreateFeedDto {
  @IsString()
  name!: string;

  @IsString()
  url!: string;

  @IsEnum(FeedType)
  type!: FeedType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
