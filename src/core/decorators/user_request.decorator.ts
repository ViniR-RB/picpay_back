import UserExcludePasswordDto from '@/modules/users/dtos/user_exclude_password.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof UserExcludePasswordDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserExcludePasswordDto = request.user;

    return data ? user?.[data] : user;
  },
);
