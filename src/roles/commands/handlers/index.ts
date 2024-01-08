import { DeleteRoleHandler } from './delete-role.handler';
import { StoreRoleHandler } from './store-role.handler';
import { UpdateRoleHandler } from './update-role.handler';

export const CommandHandlers = [
  StoreRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
];
