import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ScrapeJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('scrape_job')
export class ScrapeJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  target_url: string;

  @Column()
  target_type: string;

  @Column({
    type: 'enum',
    enum: ScrapeJobStatus,
    default: ScrapeJobStatus.PENDING,
  })
  status: ScrapeJobStatus;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  finished_at: Date;

  @Column('text', { nullable: true })
  error_log: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}