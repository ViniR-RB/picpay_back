import UserDto from '@/modules/users/dtos/user.dto';
import { Exclude } from 'class-transformer';

export default class UserSanitizedDto extends UserDto {
  @Exclude()
  declare password: string;

  @Exclude()
  declare document: string | null;
}
