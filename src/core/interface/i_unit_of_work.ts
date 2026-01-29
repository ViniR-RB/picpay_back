import IUserRepository from '@/modules/users/adapters/i_user.repository';

export default interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getUserRepository(): IUserRepository;
}
