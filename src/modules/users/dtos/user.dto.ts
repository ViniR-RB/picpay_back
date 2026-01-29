import { UserRole } from '@/modules/users/domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class UserDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  password: string;

  @ApiProperty({ examples: ['123.456.789-09', '78.618.558/0001-22', null] })
  document: string | null;

  @ApiProperty({ examples: ['USER', 'ADMIN', 'MERCHANT'] })
  role: UserRole;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
