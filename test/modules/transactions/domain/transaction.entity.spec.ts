import AmountValueObject from '@/core/value_objects/amout_value_object';
import TransactionEntity, {
  TransactionEntityProps,
} from '@/modules/transactions/domain/entities/transaction.entity';
import { TRASACTION_VALID_PROPS } from '@test/constants/transaction.constants';

describe('TransactionEntity', () => {
  it('should create a TransactionEntity using create()', () => {
    // Arrange
    const amount = AmountValueObject.fromCents(1000);
    // Act
    const transaction = TransactionEntity.create({
      ...TRASACTION_VALID_PROPS,
      amount: amount.getCents(),
    });
    // Assert
    expect(transaction.id).toBe(TRASACTION_VALID_PROPS.id);
    expect(transaction.walletSenderId).toBe(
      TRASACTION_VALID_PROPS.walletSenderId,
    );
    expect(transaction.walletReceiverId).toBe(
      TRASACTION_VALID_PROPS.walletReceiverId,
    );
    expect(transaction.amount.getCents()).toBe(
      TRASACTION_VALID_PROPS.amount.getCents(),
    );
    expect(transaction.createdAt).toBeInstanceOf(Date);
    expect(transaction.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a TransactionEntity using fromData()', () => {
    // Arrange
    const amount = AmountValueObject.fromCents(
      TRASACTION_VALID_PROPS.amount.getCents(),
    );
    const props: TransactionEntityProps = {
      id: TRASACTION_VALID_PROPS.id,
      walletSenderId: TRASACTION_VALID_PROPS.walletSenderId,
      walletReceiverId: TRASACTION_VALID_PROPS.walletReceiverId,
      amount,
      createdAt: TRASACTION_VALID_PROPS.createdAt,
      updatedAt: TRASACTION_VALID_PROPS.updatedAt,
    };
    // Act
    const transaction = TransactionEntity.fromData(props);
    // Assert
    expect(transaction.id).toBe(TRASACTION_VALID_PROPS.id);
    expect(transaction.walletSenderId).toBe(
      TRASACTION_VALID_PROPS.walletSenderId,
    );
    expect(transaction.walletReceiverId).toBe(
      TRASACTION_VALID_PROPS.walletReceiverId,
    );
    expect(transaction.amount.getCents()).toBe(
      TRASACTION_VALID_PROPS.amount.getCents(),
    );
    expect(transaction.createdAt).toBe(TRASACTION_VALID_PROPS.createdAt);
    expect(transaction.updatedAt).toBe(TRASACTION_VALID_PROPS.updatedAt);
  });

  it('should convert to object correctly', () => {
    // Arrange
    const transaction = TransactionEntity.create({
      walletSenderId: TRASACTION_VALID_PROPS.walletSenderId,
      walletReceiverId: TRASACTION_VALID_PROPS.walletReceiverId,
      amount: TRASACTION_VALID_PROPS.amount.getCents(),
      id: TRASACTION_VALID_PROPS.id,
    });
    // Act
    const obj = transaction.toObject();
    // Assert
    expect(obj).toEqual({
      id: TRASACTION_VALID_PROPS.id,
      walletSenderId: TRASACTION_VALID_PROPS.walletSenderId,
      walletReceiverId: TRASACTION_VALID_PROPS.walletReceiverId,
      amount: TRASACTION_VALID_PROPS.amount.getCents(),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
