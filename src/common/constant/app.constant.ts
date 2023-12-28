import { ResourceType } from 'src/roles/enums/resource-type.enum';
import { ResourceAction } from 'src/roles/enums/resource-action.enum';
import { RoleAvaiablePermissionMap } from '../types/role-avaiable-permission-map';

export const LOG_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS';

export const USER = {
  AVATAR_PREFIX: '/avatar',
};

export const PAGINATE_OPTIONS = {
  PAGE: 1,
  LIMIT: 20,
  SORT: {
    CREATED_AT: -1,
  },
};

export const ROLE_AVAIABLE_PERMISSION_MAP: RoleAvaiablePermissionMap = {
  [ResourceType.USER]: [
    ResourceAction.CREATE,
    ResourceAction.READ,
    ResourceAction.UPDATE,
    ResourceAction.DELETE,
    ResourceAction.EXPORT,
    ResourceAction.IMPORT,
  ],
  [ResourceType.ROLE]: [
    ResourceAction.CREATE,
    ResourceAction.READ,
    ResourceAction.UPDATE,
    ResourceAction.DELETE,
  ],
};
