import { PaginatedQuery } from '../../common/dto/pagination.dto';
import { CreateRoleDto } from './create-role.dto';

export class GetRolesWithPaginateDto extends PaginatedQuery(CreateRoleDto, [
  'description',
  'resourceActionPermission',
]) {}
