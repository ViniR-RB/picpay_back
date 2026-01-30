import IUnitOfWork from '@/core/interface/i_unit_of_work';
import IEventRepository from '@/modules/events/adapters/i_event.repository';
import EventRepository from '@/modules/events/infra/repository/event.repository';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import TransactionRepository from '@/modules/transactions/infra/repositories/transaction.repository';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserRepository from '@/modules/users/infra/repositories/user.repository';
import IWalletRepository from '@/modules/wallet/adapters/i_wallet.repository';
import WalletRepository from '@/modules/wallet/infra/repositories/wallet.repository';
import { DataSource, QueryRunner } from 'typeorm';

export default class TypeormUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner;
  constructor(private dataSource: DataSource) {}
  getEventRepository(): IEventRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getEventRepository',
      );
    }
    return new EventRepository(this.queryRunner.manager);
  }
  getTransactionRepository(): ITransactionRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getTransactionRepository',
      );
    }
    return new TransactionRepository(this.queryRunner.manager);
  }
  getWalletRepository(): IWalletRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getWalletRepository',
      );
    }
    return new WalletRepository(this.queryRunner.manager);
  }
  getUserRepository(): IUserRepository {
    if (!this.queryRunner || !this.queryRunner.manager) {
      throw new Error(
        'Transaction not started. Call start() first when getUserRepository',
      );
    }
    return new UserRepository(this.queryRunner.manager);
  }

  async start() {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit() {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  async rollback() {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }
}
