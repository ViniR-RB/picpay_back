import IUserRepository from '@/modules/users/adapters/i_user.repository';
import IWalletRepository from '@/modules/wallet/adapters/i_wallet.repository';

export default interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getWalletRepository(): IWalletRepository;
  getUserRepository(): IUserRepository;
}
