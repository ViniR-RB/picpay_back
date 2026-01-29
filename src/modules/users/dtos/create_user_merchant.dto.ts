import { UserRole } from '@/modules/users/domain/entities/user.entity';
import CreateUserDto from '@/modules/users/dtos/create_user.dto';
import { OmitType } from '@nestjs/swagger';
import { Equals, IsEnum, IsString, MinLength } from 'class-validator';

export default class CreateUserMerchantDto extends OmitType(CreateUserDto, [
  'role',
  'document',
]) {
  @IsEnum(UserRole)
  @Equals(UserRole.MERCHANT)
  role: UserRole;

  @IsString()
  @MinLength(14)
  document: string;
}
