import JwtVerifyPayload from '@/modules/auth/domain/entities/jwt_verify_payload';
import IExtractUserUseCase, {
  ExtractUserParam,
} from '@/modules/auth/domain/usecase/i_extract_user_use_case';
import JsonWebTokenService from '@/modules/auth/infra/services/json_web_token.service';
import {
  EXTRACT_USER_SERVICE,
  JWT_TOKEN_SERVICE,
} from '@/modules/auth/symbols';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_TOKEN_SERVICE)
    private readonly jwtService: JsonWebTokenService,
    @Inject(forwardRef(() => EXTRACT_USER_SERVICE))
    private readonly extractUserService: IExtractUserUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.route.path === '/api/auth/refresh') {
      return this.verifyRefreshToken(request);
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(token);
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Token is not an access token', {});
      }
      const userRequest = await this.verifyUserExistiesInDatabase(payload);
      request['user'] = userRequest;
    } catch (e) {
      throw new UnauthorizedException('Jwt Is invalid');
    }

    return true;
  }

  private async verifyUserExistiesInDatabase(
    payload: JwtVerifyPayload,
  ): Promise<UserDto> {
    const param = new ExtractUserParam(payload.sub);
    const userAlreadyExisties = await this.extractUserService.execute(param);

    if (userAlreadyExisties.isLeft()) {
      throw new UnauthorizedException('Jwt Is invalid');
    }
    const userDto = plainToClass(UserDto, {
      ...userAlreadyExisties.value.fromResponse(),
    });
    return userDto;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyRefreshToken(request: Request): Promise<boolean> {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const payload = await this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token is not a refresh token');
      }
      const userRequest = await this.verifyUserExistiesInDatabase(payload);
      request['user'] = userRequest;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }
}
