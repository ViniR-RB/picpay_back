import UseCase from '@/core/interface/use_case';
import UserEntity from '@/modules/users/domain/entities/user.entity';

export default interface IExtractUserUseCase
  extends UseCase<ExtractUserParam, ExtractUserResponse> {}

export class ExtractUserParam {
  constructor(public readonly userId: string) {}
}

export class ExtractUserResponse {
  constructor(public readonly userEntity: UserEntity) {}

  fromResponse() {
    return {
      ...this.userEntity.toObject(),
    };
  }
}
