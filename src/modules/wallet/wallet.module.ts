import CoreModule from '@/core/core_module';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';
import WalletRepository from '@/modules/wallet/infra/repositories/wallet.repository';
import { WALLET_REPOSITORY } from '@/modules/wallet/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WalletModel]), CoreModule],
  providers: [
    {
      inject: [getRepositoryToken(WalletModel)],
      provide: WALLET_REPOSITORY,
      useFactory: walletRepository => new WalletRepository(walletRepository),
    },
  ],
  exports: [WALLET_REPOSITORY],
})
export default class WalletModule {
  constructor() {}
}
