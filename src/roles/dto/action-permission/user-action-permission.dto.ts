import { PickType } from '@nestjs/swagger';
import { AllActionPermissionDto } from './all-action-permission.dto';

export class UserActionPermissionDto extends PickType(AllActionPermissionDto, [
  'read',
  'create',
  'update',
]) {}
