import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { UserActionPermissionDto } from './action-permission/user-action-permission.dto';
import { RoleActionPermissionDto } from './action-permission/role-action-permission.dto';

export class ResourceActionPermissionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserActionPermissionDto)
  user: UserActionPermissionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RoleActionPermissionDto)
  role: RoleActionPermissionDto;
}
