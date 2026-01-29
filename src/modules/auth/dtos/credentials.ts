import CreateUserDto from '@/modules/users/dtos/create_user.dto';
import { PickType } from '@nestjs/swagger';

export default class Credentials extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
