import { UserRole } from '@/modules/users/domain/entities/user.entity';
import CreateUserDto from '@/modules/users/dtos/create_user.dto';
import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Equals } from 'class-validator';

export default class CreateUserAdminDto extends OmitType(CreateUserDto, [
  'role',
  'document',
]) {
  @Equals(UserRole.ADMIN)
  declare role: UserRole;

  @Expose()
  document: null = null;
}
