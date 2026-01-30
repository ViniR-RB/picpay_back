import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import TransactionEntity from '@/modules/transactions/domain/entities/transaction.entity';
import ICreateTransactionUseCase, {
  CreateTransactionParam,
  CreateTransactionResponse,
} from '@/modules/transactions/domain/usecase/i_create_transaction.use_case';

export default class CreateTransactionService
  implements ICreateTransactionUseCase
{
  constructor(private readonly unitOfWOrk: IUnitOfWork) {}
  async execute(
    param: CreateTransactionParam,
  ): AsyncResult<AppException, CreateTransactionResponse> {
    try {
      if (param.walletSenderId === param.walletReceiverId) {
        return left(
          new ServiceException('Sender and receiver wallets must be different'),
        );
      }
      await this.unitOfWOrk.start();
      const walletRepository = this.unitOfWOrk.getWalletRepository();
      const walletSenderResult = await walletRepository.findOneByQuery({
        walletId: param.walletSenderId,
      });
      if (walletSenderResult.isLeft()) {
        await this.unitOfWOrk.rollback();
        return left(walletSenderResult.value);
      }
      const walletReceiverResult = await walletRepository.findOneByQuery({
        walletId: param.walletReceiverId,
      });
      if (walletReceiverResult.isLeft()) {
        await this.unitOfWOrk.rollback();
        return left(walletReceiverResult.value);
      }

      const transactionRepository = this.unitOfWOrk.getTransactionRepository();
      const transactionEntity = TransactionEntity.create({
        amount: param.amount,
        walletSenderId: param.walletSenderId,
        walletReceiverId: param.walletReceiverId,
      });

      walletSenderResult.value.transfer(transactionEntity.amount);
      walletReceiverResult.value.recive(transactionEntity.amount);

      const saveWalletsResult = await Promise.all([
        walletRepository.save(walletSenderResult.value),
        walletRepository.save(walletReceiverResult.value),
      ]);
      for (const result of saveWalletsResult) {
        if (result.isLeft()) {
          await this.unitOfWOrk.rollback();
          return left(result.value);
        }
      }
      const savedTransactionResult =
        await transactionRepository.save(transactionEntity);
      if (savedTransactionResult.isLeft()) {
        await this.unitOfWOrk.rollback();
        return left(savedTransactionResult.value);
      }
      await this.unitOfWOrk.commit();
      return right(new CreateTransactionResponse(savedTransactionResult.value));
    } catch (error) {
      await this.unitOfWOrk.rollback();
      if (error instanceof AppException) {
        return left(error);
      }
      return left(ServiceException.unexpectedError(error));
    }
  }
}
