import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { FindRoleQueryDto } from '../dto/find-role-query.dto';
import { Role } from '../entities/role.entity';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleAvaiablePermissionMap } from 'src/common/types/role-avaiable-permission-map';
import { ROLE_AVAIABLE_PERMISSION_MAP } from 'src/common/constant/app.constant';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async store(@Body() role: CreateRoleDto): Promise<Role> {
    return await this.rolesService.store(role);
  }

  @Get()
  async index(
    @Query() query: FindRoleQueryDto,
  ): Promise<ResponsePaginationType<Role>> {
    return await this.rolesService.findWithPaginate(query);
  }

  @Get('avaiable-permission')
  async getAvaiablePermission(): Promise<RoleAvaiablePermissionMap> {
    return ROLE_AVAIABLE_PERMISSION_MAP;
  }

  @Get(':roleId')
  async show(@Param('roleId') roleId: string): Promise<Role> {
    return this.rolesService.show(roleId);
  }

  @Patch(':roleId')
  async update(
    @Param('roleId') roleId: string,
    @Body() role: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(roleId, role);
  }

  @Delete(':roleId')
  async destroy(@Param('roleId') roleId: string): Promise<boolean> {
    return this.rolesService.destroy(roleId);
  }
}
