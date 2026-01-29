import BaseRepository from '@/core/interface/base.repository';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';

export default interface IWalletRepository
  extends BaseRepository<WalletEntity, WalletModel> {}
