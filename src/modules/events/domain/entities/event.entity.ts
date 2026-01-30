import { randomUUID } from 'crypto';

export interface EventEntityProps {
  id: string;
  serviceName: string;
  payload: any;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  createdAt: Date;
  processedAt: Date | null;
  retryCount: number;
  nextRetryAt: Date | null;
  maxRetries: number;
}

export default class EventEntity {
  private constructor(private readonly props: EventEntityProps) {
    this.props = {
      id: props.id,
      serviceName: props.serviceName,
      payload: props.payload,
      status: props.status,
      createdAt: props.createdAt,
      processedAt: props.processedAt,
      retryCount: props.retryCount,
      nextRetryAt: props.nextRetryAt,
      maxRetries: props.maxRetries,
    };
  }

  static create(
    props: Omit<
      EventEntityProps,
      | 'createdAt'
      | 'processedAt'
      | 'retryCount'
      | 'id'
      | 'nextRetryAt'
      | 'status'
    > & {
      id?: string;
    },
  ): EventEntity {
    const now = new Date();
    const propsForCreation: EventEntityProps = {
      id: props.id || randomUUID(),
      serviceName: props.serviceName,
      payload: props.payload,
      status: 'pending',
      createdAt: now,
      processedAt: null,
      retryCount: 0,
      nextRetryAt: null,
      maxRetries: props.maxRetries,
    };
    return new EventEntity(propsForCreation);
  }

  static fromData(props: EventEntityProps): EventEntity {
    return new EventEntity(props);
  }

  makeProcessing() {
    this.props.status = 'processing';
    this.props.processedAt = new Date();
  }

  makeRetry() {
    this.props.retryCount += 1;
    if (this.props.retryCount <= this.props.maxRetries) {
      const delay =
        Math.pow(2, this.props.retryCount) * 1000 + Math.random() * 1000;
      this.props.nextRetryAt = new Date(Date.now() + delay);
      this.props.status = 'pending';
      return;
    }
    this.props.status = 'failed';
  }

  get id(): string {
    return this.props.id;
  }

  get serviceName(): string {
    return this.props.serviceName;
  }

  get payload(): any {
    return this.props.payload;
  }

  get status() {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
  get processedAt(): Date | null {
    return this.props.processedAt;
  }

  get retryCount(): number {
    return this.props.retryCount;
  }

  get nextRetryAt(): Date | null {
    return this.props.nextRetryAt;
  }

  get maxRetries(): number {
    return this.props.maxRetries;
  }

  toObject() {
    return {
      id: this.id,
      serviceName: this.serviceName,
      payload: this.payload,
      status: this.status,
      createdAt: this.createdAt,
      processedAt: this.processedAt,
      retryCount: this.retryCount,
      nextRetryAt: this.nextRetryAt,
      maxRetries: this.maxRetries,
    };
  }
}
