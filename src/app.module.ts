import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import AuthModule from '@/modules/auth/auth.module';
import UsersModule from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        type: 'postgres',
        host: configurationService.get('DATABASE_HOST'),
        port: configurationService.get('DATABASE_PORT'),
        username: configurationService.get('DATABASE_USERNAME'),
        password: configurationService.get('DATABASE_PASSWORD'),
        database: configurationService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.model{.ts,.js}'],
        logging: ['error'],
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        throttlers:
          configurationService.get('NODE_ENV') === 'dev'
            ? []
            : [
                {
                  name: 'short',
                  ttl: 1000,
                  limit: 3,
                },
                {
                  name: 'medium',
                  ttl: 10000,
                  limit: 20,
                },
                {
                  name: 'long',
                  ttl: 60000,
                  limit: 100,
                },
              ],
      }),
    }),
    CoreModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
