import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Feed } from './feed.entity';

@Entity('feed_items')
@Unique('UQ_feed_items_feed_id_link', ['feedId', 'link'])
export class FeedItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  link!: string;

  @Column({ type: 'timestamptz', nullable: true })
  pubDate!: Date | null;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @ManyToOne(() => Feed, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feedId' })
  feed!: Feed;

  @Column()
  feedId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
