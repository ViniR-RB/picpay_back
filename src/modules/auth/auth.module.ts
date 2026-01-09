import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';

import ExtractUserService from '@/modules/auth/application/extract_user.service';
import LoginService from '@/modules/auth/application/login.service';
import RefreshTokenService from '@/modules/auth/application/refresh_token.service';
import AuthController from '@/modules/auth/controller/auth.controller';
import EncryptionService from '@/modules/auth/infra/services/encryption.service';
import JsonWebTokenService from '@/modules/auth/infra/services/json_web_token.service';

import {
  ENCRYPTION_SERVICE,
  EXTRACT_USER_SERVICE,
  JWT_TOKEN_SERVICE,
  LOGIN_SERVICE,
  REFRESH_TOKEN_SERVICE,
} from '@/modules/auth/symbols';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import { USER_REPOSITORY } from '@/modules/users/symbols';
import UsersModule from '@/modules/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    CoreModule,
    JwtModule.registerAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      inject: [ConfigurationService, JwtService],
      provide: JWT_TOKEN_SERVICE,
      useFactory: (
        configService: ConfigurationService,
        jwtService: JwtService,
      ) => new JsonWebTokenService(jwtService, configService),
    },
    {
      inject: [ConfigurationService],
      provide: ENCRYPTION_SERVICE,
      useFactory: (configService: ConfigurationService) =>
        new EncryptionService(configService),
    },
    {
      inject: [USER_REPOSITORY, ENCRYPTION_SERVICE, JWT_TOKEN_SERVICE],
      provide: LOGIN_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        encryptionService: EncryptionService,
        jsonWebTokenService: JsonWebTokenService,
      ) =>
        new LoginService(
          userRepository,
          encryptionService,
          jsonWebTokenService,
        ),
    },
    {
      inject: [USER_REPOSITORY],
      provide: EXTRACT_USER_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new ExtractUserService(userRepository),
    },
    {
      inject: [JWT_TOKEN_SERVICE],
      provide: REFRESH_TOKEN_SERVICE,
      useFactory: (jsonWebTokenService: JsonWebTokenService) =>
        new RefreshTokenService(jsonWebTokenService),
    },
  ],
  exports: [
    {
      inject: [USER_REPOSITORY],
      provide: EXTRACT_USER_SERVICE,
      useFactory: (userRepository: IUserRepository) =>
        new ExtractUserService(userRepository),
    },
    JWT_TOKEN_SERVICE,
    ENCRYPTION_SERVICE,
  ],
})
export default class AuthModule {}
