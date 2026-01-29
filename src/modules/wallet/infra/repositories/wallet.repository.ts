import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IWalletRepository from '@/modules/wallet/adapters/i_wallet.repository';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';
import WalletRepositoryException from '@/modules/wallet/exceptions/walley_repository.exception';
import WalletMapper from '@/modules/wallet/infra/mapper/wallet.mapper';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';
import { EntityManager, Repository } from 'typeorm';

export default class WalletRepository implements IWalletRepository {
  private readonly repository: Repository<WalletModel>;
  constructor(repoOrManager: Repository<WalletModel> | EntityManager) {
    if (repoOrManager instanceof EntityManager) {
      this.repository = repoOrManager.getRepository(WalletModel);
    } else {
      this.repository = repoOrManager;
    }
  }
  create(entity: WalletEntity): WalletModel {
    return this.repository.create(WalletMapper.toModel(entity));
  }
  async save(entity: WalletEntity): AsyncResult<AppException, WalletEntity> {
    try {
      const walletModel = WalletMapper.toModel(entity);

      const savedWallet = await this.repository.save(walletModel);

      return right(WalletMapper.toEntity(savedWallet));
    } catch (error) {
      return left(WalletRepositoryException.unexpectedError());
    }
  }
}
