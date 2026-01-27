import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IJwtTokenService from '@/modules/auth/adapters/jwt_token_service.interface';
import AuthTokenEntity from '@/modules/auth/domain/entities/auth_token.entity';
import IRefreshTokenUseCase, {
  RefreshTokenParam,
  RefreshTokenResponse,
} from '@/modules/auth/domain/usecase/i_refresh_token_use_case';

export default class RefreshTokenService implements IRefreshTokenUseCase {
  constructor(private readonly jsonWebTokenService: IJwtTokenService) {}
  async execute(
    param: RefreshTokenParam,
  ): AsyncResult<AppException, RefreshTokenResponse> {
    try {
      const accessToken = await this.jsonWebTokenService.sign({
        sub: param.sub,
        type: 'access',
        jit: crypto.randomUUID(),
      });

      const refreshToken = await this.jsonWebTokenService.sign({
        sub: param.sub,
        type: 'refresh',
        jit: crypto.randomUUID(),
      });

      return right(
        new RefreshTokenResponse(
          new AuthTokenEntity({ accessToken, refreshToken }),
        ),
      );
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error));
    }
  }
}
