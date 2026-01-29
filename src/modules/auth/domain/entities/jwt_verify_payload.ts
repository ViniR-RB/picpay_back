import { UserRole } from '@/modules/users/domain/entities/user.entity';

export default interface JwtVerifyPayload {
  sub: string;
  iat: string;
  exp: string;
  type: string;
  role: UserRole;
  jti: string;
}
