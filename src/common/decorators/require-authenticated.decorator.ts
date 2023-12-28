import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BearerAuthGuard } from 'src/auth/guards/bearer-auth.guard';

export function RequireAuthenticated() {
  return applyDecorators(
    UseGuards(BearerAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
