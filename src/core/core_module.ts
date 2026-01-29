import { validateEnvironmentVariables } from '@/core/config/enviroment.validation';
import ConfigurationService from '@/core/services/configuration.service';
import TypeormUnitOfWork from '@/core/services/typeorm_unit_of_work.service';
import { UNIT_OF_WORK } from '@/core/symbols';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: validateEnvironmentVariables,
    }),
  ],
  providers: [
    ConfigurationService,
    {
      inject: [DataSource],
      provide: UNIT_OF_WORK,
      useFactory: (dataSource: DataSource) => new TypeormUnitOfWork(dataSource),
      scope: Scope.REQUEST,
    },
  ],
  exports: [ConfigurationService, UNIT_OF_WORK],
})
export default class CoreModule {}
