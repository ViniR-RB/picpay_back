import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'transactions' })
export default class TransactionModel extends BaseModelPrimaryColumnUuid {
  @OneToMany(() => WalletModel, wallet => wallet.id)
  @JoinColumn({ name: 'wallet_sender_id' })
  walletSender: WalletModel;

  @OneToMany(() => WalletModel, wallet => wallet.id)
  @JoinColumn({ name: 'wallet_receiver_id' })
  walletReceiver: WalletModel;

  @Column('uuid', { name: 'wallet_sender_id' })
  walletSenderId: string;

  @Column('uuid', { name: 'wallet_receiver_id' })
  walletReceiverId: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  amount: number;
}
