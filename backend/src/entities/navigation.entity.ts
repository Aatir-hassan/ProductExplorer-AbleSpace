import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';

@Entity('navigation')
export class Navigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  slug: string;
  
  @Column({ nullable: true })
  source_url: string;   // 👈 <-- ADD THIS

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  last_scraped_at: Date;

  @OneToMany(() => Category, category => category.navigation)
  categories: Category[];
}