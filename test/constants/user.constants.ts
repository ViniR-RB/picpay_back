import { UserRole } from '@/modules/users/domain/entities/user.entity';

export const VALID_USER_PROPS = {
  id: '1',
  email: 'valid@email.com',
  name: 'Valid User',
  password: 'StrongPassword123',
  role: UserRole.USER,
  document: '39053344705',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
};

export const VALID_ADMIN_PROPS = {
  ...VALID_USER_PROPS,
  id: '2',
  email: 'admin@email.com',
  role: UserRole.ADMIN,
  document: null,
};

export const VALID_MERCHANT_PROPS = {
  ...VALID_USER_PROPS,
  id: '3',
  email: 'merchant@email.com',
  role: UserRole.MERCHANT,
  document: '19131243000197',
};
