import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import {
  UserRepositoryException,
  UserRepositoryNotFoundException,
} from '@/modules/users/exceptions/user_repository.exception';
import UserMapper from '@/modules/users/infra/mapper/user.mapper';
import UserModel from '@/modules/users/infra/models/user.model';
import { UserQueryOptions } from '@/modules/users/infra/query/query_objects';
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm';

export default class UserRepository implements IUserRepository {
  private readonly userRepository: Repository<UserModel>;
  constructor(repoOrManager: Repository<UserModel> | EntityManager) {
    if (repoOrManager instanceof EntityManager) {
      this.userRepository = repoOrManager.getRepository(UserModel);
    } else {
      this.userRepository = repoOrManager;
    }
  }
  create(entity: UserEntity): UserModel {
    const userModel = this.userRepository.create(UserMapper.toModel(entity));
    return userModel;
  }
  async findOne(
    query: UserQueryOptions,
  ): AsyncResult<AppException, UserEntity> {
    try {
      const qb = this.userRepository.createQueryBuilder('user');

      if (query.selectFields && query.selectFields.length > 0) {
        qb.select(query.selectFields.map(f => `user.${f}`));
      }

      if (query.relations && query.relations.length > 0) {
        for (const rel of query.relations) {
          qb.leftJoinAndSelect(`user.${rel}`, rel);
        }
      }

      if (query.userEmail) {
        qb.orWhere('user.email = :email', { email: query.userEmail });
      }
      if (query.userId) {
        qb.orWhere('user.id = :id', { id: query.userId });
      }
      if (query.userDocument) {
        qb.orWhere('user.document = :document', {
          document: query.userDocument,
        });
      }

      const userFinder = await qb.getOne();
      if (!userFinder) {
        throw new EntityNotFoundError(UserModel, 'User not found');
      }
      return right(UserMapper.toEntity(userFinder));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(new UserRepositoryNotFoundException());
      }
      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
  async save(user: UserEntity): AsyncResult<AppException, UserEntity> {
    try {
      const userModel = this.create(user);

      await this.userRepository.save(userModel);

      return right(UserMapper.toEntity(userModel));
    } catch (error) {
      return left(
        new UserRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
