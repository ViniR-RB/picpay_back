import UseCase from '@/core/interface/use_case';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';

export interface CreateTransactionParam {
  walletSenderId: string;
  walletReceiverId: string;
  amount: number;
}
export class CreateTransactionResponse {
  constructor(private readonly transactionEntity: TransactionEntity) {}

  fromResponse() {
    return this.transactionEntity.toObject();
  }
}
export default interface ICreateTransactionUseCase
  extends UseCase<CreateTransactionParam, CreateTransactionResponse> {}
