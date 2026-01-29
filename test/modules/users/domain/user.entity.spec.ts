import UserEntity from '@/modules/users/domain/entities/user.entity';
import {
  VALID_ADMIN_PROPS,
  VALID_MERCHANT_PROPS,
  VALID_USER_PROPS,
} from '@test/constants/user.constants';

describe('UserEntity', () => {
  it('should create a valid USER', () => {
    const props = { ...VALID_USER_PROPS };
    const user = UserEntity.create(props);
    expect(user.toObject()).toMatchObject({
      id: props.id,
      email: props.email,
      name: props.name,
      document: props.document,
      role: props.role,
      password: props.password,
    });
  });

  it('should create a valid ADMIN', () => {
    const props = { ...VALID_ADMIN_PROPS };
    const user = UserEntity.create(props);
    expect(user.toObject()).toMatchObject({
      id: props.id,
      email: props.email,
      name: props.name,
      document: props.document,
      role: props.role,
      password: props.password,
    });
  });

  it('should create a valid MERCHANT', () => {
    const props = { ...VALID_MERCHANT_PROPS };
    const user = UserEntity.create(props);
    expect(user.toObject()).toMatchObject({
      id: props.id,
      email: props.email,
      name: props.name,
      document: props.document,
      role: props.role,
      password: props.password,
    });
  });

  it('should throw an exception for invalid email', () => {
    const props = { ...VALID_USER_PROPS, email: 'invalid-email' };
    expect(() => UserEntity.create(props)).toThrow('Invalid email');
  });

  it('should throw an exception for invalid name', () => {
    const props = { ...VALID_USER_PROPS, name: '' };
    expect(() => UserEntity.create(props)).toThrow('Invalid name');
  });

  it('should throw an exception for invalid password', () => {
    const props = { ...VALID_USER_PROPS, password: '123' };
    expect(() => UserEntity.create(props)).toThrow('Invalid password');
  });
  it('should throw an exception for invalid document', () => {
    const props = { ...VALID_USER_PROPS, document: '12345678900' };
    expect(() => UserEntity.create(props)).toThrow('Invalid document');
  });
});
