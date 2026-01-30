import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';

export interface FindOneByQueryWallet {
  selectFields?: (keyof WalletModel)[];
  relations?: string[];
  walletId?: string;
}

export default interface IWalletRepository
  extends BaseRepository<WalletEntity, WalletModel> {
  findOneByQuery(
    query: FindOneByQueryWallet,
  ): AsyncResult<AppException, WalletEntity>;
}
