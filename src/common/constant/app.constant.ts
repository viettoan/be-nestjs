import { ResourceType } from 'src/roles/enums/resource-type.enum';
import { ResourceAction } from 'src/roles/enums/resource-action.enum';
import { RoleAvaiablePermissionMap } from '../types/role-avaiable-permission-map';

export const LOG_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS';

export const USER = {
  AVATAR_PREFIX: '/avatar',
  DEFAULT_PASSWORD: '12345678',
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

export const QUERY_BATCHING_SIZE = 500;

export const EXCEL_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const USER_IMPORT_HEADER_PREFIXES = ['STT', 'Name', 'Email', 'Phone'];
