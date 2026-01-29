import IUnitOfWork from '@/core/interface/i_unit_of_work';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserRepository from '@/modules/users/infra/repositories/user.repository';
import IWalletRepository from '@/modules/wallet/adapters/i_wallet.repository';
import WalletRepository from '@/modules/wallet/infra/repositories/wallet.repository';
import { DataSource, QueryRunner } from 'typeorm';

export default class TypeormUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner;
  constructor(private dataSource: DataSource) {}
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
