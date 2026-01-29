import AmoutValueObject from '@/core/value_objects/amout_value_object';
import { randomUUID } from 'crypto';

export interface WalletEntityProps {
  id: string;
  amount: AmoutValueObject;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class WalletEntity {
  private constructor(private readonly props: WalletEntityProps) {
    this.props = {
      id: props.id,
      amount: props.amount,
      userId: props.userId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
  static validate(props: Partial<WalletEntityProps>) {}

  static create(
    props: Omit<
      WalletEntityProps,
      'id' | 'amount' | 'createdAt' | 'updatedAt'
    > & { id?: string; amount: number },
  ): WalletEntity {
    const now = new Date();
    const propsForCreation: WalletEntityProps = {
      id: props.id || randomUUID(),
      amount: AmoutValueObject.fromCents(props.amount),
      createdAt: now,
      updatedAt: now,
      userId: props.userId,
    };
    this.validate(propsForCreation);
    return new WalletEntity(propsForCreation);
  }

  static fromData(props: WalletEntityProps): WalletEntity {
    return new WalletEntity(props);
  }

  transfer(amount: AmoutValueObject) {
    this.props.amount = this.amount.subtract(amount);
    this.toTouch();
  }

  private toTouch() {
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get amount() {
    return this.props.amount;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
