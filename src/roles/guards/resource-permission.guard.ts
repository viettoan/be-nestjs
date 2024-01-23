import { Injectable, CanActivate, ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { ResourceType } from '../enums/resource-type.enum';
import { ResourceAction } from '../enums/resource-action.enum';
import { ResourceActionPermissionValue } from '../enums/resource-action-permission-value.enum';
import { checkUserHasPermission } from 'src/users/ultils/check-user-have-permission';
import { User } from 'src/entities/mongodb/user.entity';

@Injectable()
export class ResourcePermissionGuard implements CanActivate {
  constructor(
    private resource: ResourceType,
    private action: ResourceAction,
    private permissionValues: (ResourceActionPermissionValue | undefined)[],
  ) {}

  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest().user as User;
    const allowed = checkUserHasPermission(
      this.resource,
      this.action,
      this.permissionValues,
      user,
    );

    if (!allowed) {
      throw new ForbiddenException('User khong co quyen thuc hien tac vu nay');
    }

    return true;
  }
}
