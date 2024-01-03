import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { FindRoleQueryDto } from '../dto/find-role-query.dto';
import { Role } from '../entities/role.entity';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleAvaiablePermissionMap } from 'src/common/types/role-avaiable-permission-map';
import { ROLE_AVAIABLE_PERMISSION_MAP } from 'src/common/constant/app.constant';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { ResourceType } from '../enums/resource-type.enum';
import { ResourceAction } from '../enums/resource-action.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/mongodb/user.entity';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @RequirePermission(ResourceType.ROLE, ResourceAction.CREATE)
  async store(
    @Body() role: CreateRoleDto,
    @CurrentUser() currentUser: User,
  ): Promise<Role> {
    return await this.rolesService.store(role, currentUser);
  }

  @Get()
  @RequirePermission(ResourceType.ROLE, ResourceAction.READ)
  async index(
    @Query() query: FindRoleQueryDto,
  ): Promise<ResponsePaginationType<Role>> {
    return await this.rolesService.findWithPaginate(query);
  }

  @Get('avaiable-permission')
  @RequirePermission(ResourceType.ROLE, ResourceAction.READ)
  async getAvaiablePermission(): Promise<RoleAvaiablePermissionMap> {
    return ROLE_AVAIABLE_PERMISSION_MAP;
  }

  @Get(':roleId')
  @RequirePermission(ResourceType.ROLE, ResourceAction.READ)
  async show(@Param('roleId') roleId: string): Promise<Role> {
    return this.rolesService.show(roleId);
  }

  @Patch(':roleId')
  @RequirePermission(ResourceType.ROLE, ResourceAction.UPDATE)
  async update(
    @Param('roleId') roleId: string,
    @Body() role: UpdateRoleDto,
    @CurrentUser() currentUser: User,
  ): Promise<Role> {
    return this.rolesService.update(roleId, role, currentUser);
  }

  @Delete(':roleId')
  @RequirePermission(ResourceType.ROLE, ResourceAction.DELETE)
  async destroy(@Param('roleId') roleId: string): Promise<boolean> {
    return this.rolesService.destroy(roleId);
  }
}
