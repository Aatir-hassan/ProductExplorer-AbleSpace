import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('view_history')
export class ViewHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column()
  session_id: string;

  @Column('jsonb')
  path_json: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}