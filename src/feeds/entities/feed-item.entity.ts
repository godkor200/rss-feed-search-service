import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Feed } from './feed.entity';

@Entity('feed_items')
export class FeedItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column()
  link!: string;

  @Column({ nullable: true })
  pubDate!: Date;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @ManyToOne(() => Feed, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feedId' })
  feed!: Feed;

  @Column()
  feedId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}