import { ResourceActionPermissionValue } from 'src/roles/enums/resource-action-permission-value.enum';
import { ResourceAction } from 'src/roles/enums/resource-action.enum';
import { ResourceType } from 'src/roles/enums/resource-type.enum';
import { User } from '../entities/mongodb/user.entity';
import { UserIsConfirmAccount } from '../enum/user-is-confirm-account.enum';

export function checkUserHasPermission(
  resourceType: ResourceType,
  resourceAction: ResourceAction,
  permissionValues: (ResourceActionPermissionValue | undefined)[],
  user?: User,
) {
  if (!user) {
    return false;
  }

  if (
    !user ||
    !user.roles ||
    !user.roles.length ||
    user.isConfirmAccount !== UserIsConfirmAccount.TRUE
  ) {
    return false;
  }
  let allowed = false;
  user.roles.forEach((role) => {
    allowed ||= permissionValues.includes(
      role['resourceActionPermission']?.[resourceType]?.[resourceAction],
    );
  });

  return allowed;
}
