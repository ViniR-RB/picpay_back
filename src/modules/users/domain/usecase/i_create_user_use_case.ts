import UseCase from '@/core/interface/use_case';
import UserEntity, {
  UserRole,
} from '@/modules/users/domain/entities/user.entity';

export default interface ICreateUserUseCase
  extends UseCase<CreateUserParam, CreateUserResponse> {}

export class CreateUserParam {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly document: string,
  ) {}
}

export class CreateUserResponse {
  constructor(public readonly userEntity: UserEntity) {}

  fromResponse() {
    return {
      ...this.userEntity.toObject(),
    };
  }
}
