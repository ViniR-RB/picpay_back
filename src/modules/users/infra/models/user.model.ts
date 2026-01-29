import { BaseModelPrimaryColumnUuid } from '@/core/interface/base_model';
import { UserRole } from '@/modules/users/domain/entities/user.entity';
import { Column, Entity } from 'typeorm';

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

  @Column({ name: 'document', unique: true, length: 14, nullable: true })
  document: string | null;
}
