import { PaginatedQuery } from '../../common/dto/pagination.dto';
import { CreateRoleDto } from './role.dto';
import { IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNonEmptyString } from '../../common/transforms/toNonEmptyString.transform';

export class FindRoleQueryDto extends PaginatedQuery(CreateRoleDto, [
  'resourceActionPermission',
]) {}
