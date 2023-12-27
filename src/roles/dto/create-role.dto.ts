import {
  IsString,
  MaxLength,
  IsBoolean,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toBoolean } from '../../common/transforms/to-boolean.transform';
import { toNonEmptyString } from '../../common/transforms/to-non-empty-string.transform';
import { ResourceActionPermissionDto } from './resource-action-permission.dto';

export class CreateRoleDto {
  @IsString()
  @MaxLength(50)
  @Transform(toNonEmptyString)
  code: string;

  @IsString()
  @MaxLength(50)
  @Transform(toNonEmptyString)
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(toNonEmptyString)
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(toBoolean)
  isActive?: boolean;

  @ValidateNested()
  @IsObject()
  @Type(() => ResourceActionPermissionDto)
  resourceActionPermission: ResourceActionPermissionDto;
}