import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionRepositoryException from '@/modules/transactions/exceptions/transaction_repository.exception';
import TransactionMapper from '@/modules/transactions/infra/mapper/transaction.mapper';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';
import { EntityManager, Repository } from 'typeorm';

export default class TransactionRepository implements ITransactionRepository {
  private readonly repository: Repository<TransactionModel>;
  constructor(repoOrManager: Repository<TransactionModel> | EntityManager) {
    if (repoOrManager instanceof EntityManager) {
      this.repository = repoOrManager.getRepository(TransactionModel);
    } else {
      this.repository = repoOrManager;
    }
  }
  create(entity: TransactionEntity): TransactionModel {
    return this.repository.create(TransactionMapper.toModel(entity));
  }
  async save(
    entity: TransactionEntity,
  ): AsyncResult<AppException, TransactionEntity> {
    try {
      const savedModel = await this.repository.save(this.create(entity));

      return right(TransactionMapper.toEntity(savedModel));
    } catch (error) {
      return left(TransactionRepositoryException.unexpectedError(error));
    }
  }
}
