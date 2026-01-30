import IEventRepository from '@/modules/events/adapters/i_event.repository';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IWalletRepository from '@/modules/wallet/adapters/i_wallet.repository';

export default interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getWalletRepository(): IWalletRepository;
  getUserRepository(): IUserRepository;
  getEventRepository(): IEventRepository;
  getTransactionRepository(): ITransactionRepository;
}
