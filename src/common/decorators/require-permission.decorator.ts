import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BearerAuthGuard } from 'src/auth/guards/bearer-auth.guard';
import { ResourceActionPermissionValue } from 'src/roles/enums/resource-action-permission-value.enum';
import { ResourceAction } from 'src/roles/enums/resource-action.enum';
import { ResourceType } from 'src/roles/enums/resource-type.enum';
import { ResourcePermissionGuard } from 'src/roles/guards/resource-permission.guard';

export function RequirePermission(
  resource: ResourceType,
  action: ResourceAction,
  ...permissionValues: ResourceActionPermissionValue[]
) {
  return applyDecorators(
    UseGuards(
      BearerAuthGuard,
      new ResourcePermissionGuard(
        resource,
        action,
        permissionValues.length
          ? permissionValues
          : [ResourceActionPermissionValue.ALL],
      ),
    ),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'test' }),
  );
}
