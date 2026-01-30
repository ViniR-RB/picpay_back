import AmountValueObject from '@/core/value_objects/amout_value_object';

export const TRASACTION_VALID_PROPS = {
  id: 'transaction-id-123',
  walletSenderId: 'wallet-sender-id-456',
  walletReceiverId: 'wallet-receiver-id-789',
  amount: AmountValueObject.fromCents(1000),
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-02T00:00:00Z'),
};
