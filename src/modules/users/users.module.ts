import CoreModule from '@/core/core_module';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import { UNIT_OF_WORK } from '@/core/symbols';
import IEncryptionService from '@/modules/auth/adapters/encryption_service.interface';
import AuthModule from '@/modules/auth/auth.module';
import { ENCRYPTION_SERVICE } from '@/modules/auth/symbols';
import CreateUserService from '@/modules/users/application/create_user.service';
import UserModel from '@/modules/users/infra/models/user.model';
import UserRepository from '@/modules/users/infra/repositories/user.repository';
import { CREATE_USER_SERVICE, USER_REPOSITORY } from '@/modules/users/symbols';
import { forwardRef, Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    CoreModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserModel]),
  ],
  providers: [
    {
      inject: [getRepositoryToken(UserModel)],
      provide: USER_REPOSITORY,
      useFactory: (userRepository: Repository<UserModel>) =>
        new UserRepository(userRepository),
    },
    {
      inject: [UNIT_OF_WORK, ENCRYPTION_SERVICE],
      provide: CREATE_USER_SERVICE,
      useFactory: (unitOfWork: IUnitOfWork, encryption: IEncryptionService) =>
        new CreateUserService(encryption, unitOfWork),
    },
  ],
  exports: [CREATE_USER_SERVICE, USER_REPOSITORY],
})
export default class UsersModule {}
