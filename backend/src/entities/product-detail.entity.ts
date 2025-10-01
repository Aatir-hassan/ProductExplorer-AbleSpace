import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_detail')
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  product_id: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  specs: Record<string, any>;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  ratings_avg: number;

  @Column({ default: 0 })
  reviews_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Product, product => product.detail)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}