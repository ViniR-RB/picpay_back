import BaseMapper from '@/core/mappers/base.mapper';
import AmountValueObject from '@/core/value_objects/amout_value_object';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';

export default abstract class TransactionMapper extends BaseMapper<
  TransactionEntity,
  TransactionModel
> {
  static toModel(entity: TransactionEntity): Partial<TransactionModel> {
    return {
      id: entity.id,
      amount: entity.amount.getReais(),
      walletReceiverId: entity.walletReceiverId,
      walletSenderId: entity.walletSenderId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  static toEntity(model: TransactionModel): TransactionEntity {
    return TransactionEntity.fromData({
      id: model.id,
      amount: AmountValueObject.fromReais(model.amount),
      walletReceiverId: model.walletReceiverId,
      walletSenderId: model.walletSenderId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
