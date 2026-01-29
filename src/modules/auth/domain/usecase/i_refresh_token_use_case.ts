import UseCase from '@/core/interface/use_case';
import AuthTokenEntity from '@/modules/auth/domain/entities/auth_token.entity';

export default interface IRefreshTokenUseCase
  extends UseCase<RefreshTokenParam, RefreshTokenResponse> {}

export class RefreshTokenParam {
  constructor(public readonly sub: string) {}
}

export class RefreshTokenResponse {
  constructor(public readonly authTokens: AuthTokenEntity) {}

  fromResponse() {
    return this.authTokens.toObject();
  }
}
