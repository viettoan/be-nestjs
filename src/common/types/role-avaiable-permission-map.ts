import { ResourceType } from 'src/roles/enums/resource-type.enum';
import { ResourceAction } from 'src/roles/enums/resource-action.enum';

export type RoleAvaiablePermissionMap = Omit<
  {
    [P in ResourceType]: ResourceAction[];
  },
  ResourceType.ADMIN
>;
