import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FeedItem } from './feed-item.entity';

export enum FeedType {
  RSS = 'RSS',
  BLOG = 'BLOG',
  NEWS = 'NEWS',
}

@Entity('feeds')
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  url!: string;

  @Column({ type: 'enum', enum: FeedType })
  type!: FeedType;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => FeedItem, (feedItem) => feedItem.feed)
  items!: FeedItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
