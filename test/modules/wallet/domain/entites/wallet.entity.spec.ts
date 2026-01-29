import AmoutValueObject from '@/core/value_objects/amout_value_object';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';
import { VALID_WALLET_PROPS } from '@test/constants/wallet.constants';

describe('WalletEntity', () => {
  it('should create a valid wallet', () => {
    // Arrange
    const props = { ...VALID_WALLET_PROPS };
    // Act
    const wallet = WalletEntity.create(props);
    // Assert
    expect(wallet.id).toBe(props.id);
    expect(wallet.amount.getCents()).toBe(props.amount);
    expect(wallet.userId).toBe(props.userId);
  });

  it('should transfer amount and update updatedAt', () => {
    // Arrange
    const props = { ...VALID_WALLET_PROPS };
    const wallet = WalletEntity.create(props);
    const transferAmount = AmoutValueObject.fromCents(5000); // 50 reais
    const oldUpdatedAt = wallet.updatedAt;
    // Act
    wallet.transfer(transferAmount);
    // Assert
    expect(wallet.amount.getCents()).toBe(props.amount - 5000);
    expect(wallet.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });
});
