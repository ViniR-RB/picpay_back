import DocumentValidator from '@/core/validators/document.validator';
import EmailValidator from '@/core/validators/email.validator';
import NameValidator from '@/core/validators/name.validator';
import PasswordValidator from '@/core/validators/password.validator';
import UserDomainException from '@/modules/users/exceptions/user_domain_exception';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MERCHANT = 'MERCHANT',
}
interface UserEntityProps {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  document: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class UserEntity {
  private constructor(private readonly props: UserEntityProps) {
    this.props = {
      id: props.id,
      email: props.email,
      name: props.name,
      role: props.role,
      document: props.document,
      password: props.password,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }

  private static validade(props: Partial<UserEntityProps>) {
    if (props.email !== undefined && !EmailValidator.validate(props.email)) {
      throw new UserDomainException('Invalid email');
    }
    if (props.name !== undefined && !NameValidator.validate(props.name)) {
      throw new UserDomainException('Invalid name');
    }
    if (
      props.password !== undefined &&
      !PasswordValidator.validate(props.password)
    ) {
      throw new UserDomainException('Invalid password');
    }
    if (
      props.document !== undefined &&
      props.document !== null &&
      !DocumentValidator.validate(props.document)
    ) {
      throw new UserDomainException('Invalid document');
    }
    if (
      props.role !== undefined &&
      !Object.values(UserRole).includes(props.role)
    ) {
      throw new UserDomainException('Invalid role');
    }
  }

  static create(
    props: Omit<UserEntityProps, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
    },
  ) {
    const now = new Date();
    const propsForValidation: UserEntityProps = {
      id: props.id || crypto.randomUUID(),
      email: props.email,
      name: props.name,
      document: props.document,
      role: props.role,
      password: props.password,
      createdAt: now,
      updatedAt: now,
    };
    this.validade(propsForValidation);
    return new UserEntity(propsForValidation);
  }

  static fromData(props: UserEntityProps) {
    return new UserEntity(props);
  }

  changePassword(newPasswordHash: string) {
    this.props.password = newPasswordHash;
  }

  get id() {
    if (!this.props.id) {
      throw new UserDomainException('User Id has no generated');
    }
    return this.props.id!;
  }
  get email() {
    return this.props.email!;
  }

  get password() {
    return this.props.password;
  }

  get document() {
    return this.props.document;
  }

  get role() {
    return this.props.role;
  }
  get createdAt() {
    return this.props.createdAt!;
  }
  get updatedAt() {
    return this.props.updatedAt!;
  }

  toObject() {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      document: this.props.document,
      role: this.props.role,
      password: this.props.password,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
