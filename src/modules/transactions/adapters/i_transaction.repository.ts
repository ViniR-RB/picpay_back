import BaseRepository from '@/core/interface/base.repository';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import TransactionModel from '@/modules/transactions/infra/models/transaction.model';

export default interface ITransactionRepository
  extends BaseRepository<TransactionEntity, TransactionModel> {}
