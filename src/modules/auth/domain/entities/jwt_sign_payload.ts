import { UserRole } from '@/modules/users/domain/entities/user.entity';

export default interface JwtSignPayload {
  sub: string;
  type: 'access' | 'refresh';
  role: UserRole;
  jit: string;
}
