import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { UserActionPermissionDto } from './action-permission/user-action-permission.dto';

export class ResourceActionPermissionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserActionPermissionDto)
  user: UserActionPermissionDto;
}
