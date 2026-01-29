import { UserRole } from '@/modules/users/domain/entities/user.entity';
import UserDto from '@/modules/users/dtos/user.dto';
import { OmitType } from '@nestjs/swagger';
import { Equals, IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export default class CreateUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'role',
  'updatedAt',
]) {
  @IsString()
  @MinLength(11)
  document: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @Equals(UserRole.USER)
  role: UserRole;
}
