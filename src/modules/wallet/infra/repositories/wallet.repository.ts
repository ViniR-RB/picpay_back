import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IWalletRepository, {
  FindOneByQueryWallet,
} from '@/modules/wallet/adapters/i_wallet.repository';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';
import WalletRepositoryException from '@/modules/wallet/exceptions/walley_repository.exception';
import WalletMapper from '@/modules/wallet/infra/mapper/wallet.mapper';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm';

export default class WalletRepository implements IWalletRepository {
  private readonly repository: Repository<WalletModel>;
  constructor(repoOrManager: Repository<WalletModel> | EntityManager) {
    if (repoOrManager instanceof EntityManager) {
      this.repository = repoOrManager.getRepository(WalletModel);
    } else {
      this.repository = repoOrManager;
    }
  }
  async findOneByQuery(
    query: FindOneByQueryWallet,
  ): AsyncResult<AppException, WalletEntity> {
    try {
      const qb = this.repository.createQueryBuilder('wallet');

      if (query.selectFields && query.selectFields.length > 0) {
        qb.select(query.selectFields.map(f => `wallet.${f}`));
      }

      if (query.relations && query.relations.length > 0) {
        for (const rel of query.relations) {
          qb.leftJoinAndSelect(`wallet.${rel}`, rel);
        }
      }

      if (query.walletId) {
        qb.orWhere('wallet.id = :walletId', { walletId: query.walletId });
      }

      const walletFinder = await qb.getOneOrFail();

      return right(WalletMapper.toEntity(walletFinder));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(WalletRepositoryException.notFound());
      }
      return left(WalletRepositoryException.unexpectedError());
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
