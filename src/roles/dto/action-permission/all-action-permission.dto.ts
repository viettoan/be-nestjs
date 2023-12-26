import { IsEnum } from 'class-validator';
import { ResourceActionPermissionValue } from '../../enums/resource-action-permission-value.enum';

export class AllActionPermissionDto {
  @IsEnum(ResourceActionPermissionValue)
  read: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  export: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  import: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  create: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  update: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  lock: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  delete: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  execute: ResourceActionPermissionValue;

  @IsEnum(ResourceActionPermissionValue)
  approve: ResourceActionPermissionValue;
}
