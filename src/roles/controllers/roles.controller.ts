import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/role.dto';
import { FindRoleQueryDto } from '../dto/find-role-query.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  async store(@Body() role: CreateRoleDto) {
    return await this.roleService.store(role);
  }

  @Get()
  async index(@Query() query: FindRoleQueryDto) {
    return await this.roleService.find(query);
  }
}
