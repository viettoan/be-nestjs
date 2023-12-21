import { ResourceAction } from '../enums/resource-action.enum';
import { ResourceType } from '../enums/resource-type.enum';
import { ResourceActionPermissionValue } from '../enums/resource-action-permission-value.enum';

export type ResourceTypePermission = {
  [K in ResourceAction]?: ResourceActionPermissionValue;
};

export type ResourceActionPermission = {
  [P in ResourceType]?: ResourceTypePermission;
};
