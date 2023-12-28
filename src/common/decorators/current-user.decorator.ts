import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/mongodb/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();

    return ctx.getRequest<{ user: User }>().user;
  },
);
