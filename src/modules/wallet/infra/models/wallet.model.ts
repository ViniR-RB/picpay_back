import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import UserModel from '@/modules/users/infra/models/user.model';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'wallets',
})
export default class WalletModel extends BaseModelPrimaryColumnUuid {
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @OneToOne(() => UserModel, user => user.wallet)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @Column({ name: 'userId' })
  userId: string;
}
