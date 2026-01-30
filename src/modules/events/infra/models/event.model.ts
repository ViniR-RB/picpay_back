import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'events' })
export default class EventModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  serviceName: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'processed', 'failed'],
  })
  status: 'pending' | 'processing' | 'processed' | 'failed';

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'int' })
  retryCount: number;

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt: Date | null;

  @Column({ type: 'int' })
  maxRetries: number;
}
