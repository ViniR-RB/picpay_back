import AmountValueObject from '@/core/value_objects/amout_value_object';

export interface TransactionEntityProps {
  id: string;
  walletSenderId: string;
  walletReceiverId: string;
  amount: AmountValueObject;
  createdAt: Date;
  updatedAt: Date;
}
export default class TransactionEntity {
  private constructor(private readonly props: TransactionEntityProps) {
    this.props = {
      id: props.id,
      walletSenderId: props.walletSenderId,
      walletReceiverId: props.walletReceiverId,
      amount: props.amount,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  static create(
    props: Omit<
      TransactionEntityProps,
      'createdAt' | 'updatedAt' | 'id' | 'amount'
    > & {
      id?: string;
      amount: number;
    },
  ): TransactionEntity {
    const now = new Date();
    const propsForCreation: TransactionEntityProps = {
      id: props.id || crypto.randomUUID(),
      walletSenderId: props.walletSenderId,
      walletReceiverId: props.walletReceiverId,
      amount: AmountValueObject.fromCents(props.amount),
      createdAt: now,
      updatedAt: now,
    };
    return new TransactionEntity(propsForCreation);
  }

  static fromData(props: TransactionEntityProps): TransactionEntity {
    return new TransactionEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get walletSenderId(): string {
    return this.props.walletSenderId;
  }
  get walletReceiverId(): string {
    return this.props.walletReceiverId;
  }
  get amount(): AmountValueObject {
    return this.props.amount;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  toObject() {
    return {
      id: this.props.id,
      walletSenderId: this.props.walletSenderId,
      walletReceiverId: this.props.walletReceiverId,
      amount: this.props.amount.getCents(),
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
