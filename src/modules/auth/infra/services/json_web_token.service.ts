import ErrorMessages from '@/core/constants/error_messages';
import JsonWebServiceException from '@/core/exceptions/json_web_service.exception';
import ConfigurationService from '@/core/services/configuration.service';
import IJwtTokenService from '@/modules/auth/adapters/jwt_token_service.interface';
import JwtSignPayload from '@/modules/auth/domain/entities/jwt_sign_payload';
import JwtVerifyPayload from '@/modules/auth/domain/entities/jwt_verify_payload';
import { JwtService } from '@nestjs/jwt';

export default class JsonWebTokenService implements IJwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async sign(payload: JwtSignPayload) {
    try {
      if (payload.type === 'access') {
        return this.jwtService.sign(payload, {
          expiresIn: this.configurationService.get(
            'ACCESS_TOKEN_EXPIRES_IN_SECONDS',
          ),
        });
      }
      return this.jwtService.sign(payload, {
        expiresIn: this.configurationService.get(
          'REFRESH_TOKEN_EXPIRES_IN_SECONDS',
        ),
      });
    } catch (error) {
      throw new JsonWebServiceException(
        ErrorMessages.UNEXPECTED_ERROR,
        500,
        error,
      );
    }
  }

  async verify(token: string): Promise<JwtVerifyPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtVerifyPayload>(
        token,
        {
          secret: this.configurationService.get('JWT_SECRET'),
        },
      );
      return payload;
    } catch (error) {
      throw new JsonWebServiceException(
        ErrorMessages.UNEXPECTED_ERROR,
        500,
        error,
      );
    }
  }
}
