import JwtSignPayload from '@/modules/auth/domain/entities/jwt_sign_payload';
import JwtVerifyPayload from '@/modules/auth/domain/entities/jwt_verify_payload';

export default interface IJwtTokenService {
  sign(payload: JwtSignPayload): Promise<string>;
  verify(token: string): Promise<JwtVerifyPayload>;
}
