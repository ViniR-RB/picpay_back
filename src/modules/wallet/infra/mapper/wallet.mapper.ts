import BaseMapper from '@/core/mappers/base.mapper';
import AmountValueObject from '@/core/value_objects/amout_value_object';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';

export default abstract class WalletMapper extends BaseMapper<
  WalletEntity,
  WalletModel
> {
  static toEntity(model: WalletModel): WalletEntity {
    return WalletEntity.fromData({
      id: model.id,
      userId: model.userId,
      amount: AmountValueObject.fromReais(model.amount),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: WalletEntity): Partial<WalletModel> {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount.getReais(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
