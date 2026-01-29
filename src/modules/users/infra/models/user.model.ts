import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import { UserRole } from '@/modules/users/domain/entities/user.entity';
import WalletModel from '@/modules/wallet/infra/models/wallet.model';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'users' })
export default class UserModel extends BaseModelPrimaryColumnUuid {
  @Column({ name: 'password', select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'role', enum: UserRole, type: 'enum' })
  role: UserRole;

  @Column({
    name: 'document',
    type: 'varchar',
    unique: true,
    length: 14,
    nullable: true,
  })
  document: string | null;

  @OneToOne(() => WalletModel, wallet => wallet.user, { nullable: true })
  @JoinColumn({ name: 'walletId' })
  wallet: WalletModel;
}
