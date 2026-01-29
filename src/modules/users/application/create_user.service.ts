import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IEncryptionService from '@/modules/auth/adapters/encryption_service.interface';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserEntity, {
  UserRole,
} from '@/modules/users/domain/entities/user.entity';
import ICreateUserUseCase, {
  CreateUserParam,
  CreateUserResponse,
} from '@/modules/users/domain/usecase/i_create_user_use_case';
import { UserRepositoryNotFoundException } from '@/modules/users/exceptions/user_repository.exception';
import WalletEntity from '@/modules/wallet/domain/entities/wallet.entity';

export default class CreateUserService implements ICreateUserUseCase {
  constructor(
    private readonly encryptionService: IEncryptionService,
    private readonly unitOfWork: IUnitOfWork,
  ) {}
  async execute(
    param: CreateUserParam,
  ): AsyncResult<AppException, CreateUserResponse> {
    try {
      await this.unitOfWork.start();
      const userRepository: IUserRepository =
        this.unitOfWork.getUserRepository();
      const userExists = await userRepository.findOne({
        userEmail: param.email,
        userDocument: param.document,
      });

      if (userExists.isRight()) {
        await this.unitOfWork.rollback();
        return left(
          new ServiceException(ErrorMessages.USER_ALREADY_EXISTS, 409),
        );
      }

      if (
        userExists.isLeft() &&
        !(userExists.value instanceof UserRepositoryNotFoundException)
      ) {
        await this.unitOfWork.rollback();
        return left(userExists.value);
      }

      const userEntity = UserEntity.create({ ...param });

      const encryptionPassword = await this.encryptionService.hashString(
        userEntity.password,
      );

      userEntity.changePassword(encryptionPassword);

      const userSavedResult = await userRepository.save(userEntity);

      if (userSavedResult.isLeft()) {
        await this.unitOfWork.rollback();
        return left(userSavedResult.value);
      }

      if (param.role !== UserRole.ADMIN) {
        const walletRepository = this.unitOfWork.getWalletRepository();
        const walletSaveResult = await walletRepository.save(
          WalletEntity.create({
            amount: 0,
            userId: userSavedResult.value.id,
          }),
        );
        if (walletSaveResult.isLeft()) {
          await this.unitOfWork.rollback();
          return left(walletSaveResult.value);
        }
      }

      await this.unitOfWork.commit();
      return right(new CreateUserResponse(userSavedResult.value));
    } catch (error) {
      await this.unitOfWork.rollback();
      if (error instanceof AppException) {
        return left(error);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error));
    }
  }
}
