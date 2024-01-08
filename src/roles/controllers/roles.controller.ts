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
import { CreateRoleDto } from '../dto/create-role.dto';
import { GetRolesWithPaginateDto } from '../dto/get-roles-with-paginate.dto';
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindRoleQuery } from '../queries/impl/find-role.query';
import { GetRolesWithPaginateQuery } from '../queries/impl/get-roles-with-paginate.query';
import { StoreRoleCommand } from '../commands/impl/store-role.command';
import { UpdateRoleCommand } from '../commands/impl/update-role.command';
import { DeleteRoleCommand } from '../commands/impl/delete-role.command';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @RequirePermission(ResourceType.ROLE, ResourceAction.CREATE)
  async store(
    @Body() role: CreateRoleDto,
    @CurrentUser() currentUser: User,
  ): Promise<Role> {
    return await this.commandBus.execute(
      new StoreRoleCommand(role, currentUser),
    );
  }

  @Get()
  @RequirePermission(ResourceType.ROLE, ResourceAction.READ)
  async index(
    @Query() query: GetRolesWithPaginateDto,
  ): Promise<ResponsePaginationType<Role>> {
    return await this.queryBus.execute(new GetRolesWithPaginateQuery(query));
  }

  @Get('avaiable-permission')
  @RequirePermission(ResourceType.ROLE, ResourceAction.READ)
  async getAvaiablePermission(): Promise<RoleAvaiablePermissionMap> {
    return ROLE_AVAIABLE_PERMISSION_MAP;
  }

  @Get(':roleId')
  @RequirePermission(ResourceType.ROLE, ResourceAction.READ)
  async show(@Param('roleId') roleId: string): Promise<Role> {
    return this.queryBus.execute(new FindRoleQuery(roleId));
  }

  @Patch(':roleId')
  @RequirePermission(ResourceType.ROLE, ResourceAction.UPDATE)
  async update(
    @Param('roleId') roleId: string,
    @Body() role: UpdateRoleDto,
    @CurrentUser() currentUser: User,
  ): Promise<Role> {
    return this.commandBus.execute(
      new UpdateRoleCommand(roleId, role, currentUser),
    );
  }

  @Delete(':roleId')
  @RequirePermission(ResourceType.ROLE, ResourceAction.DELETE)
  async destroy(@Param('roleId') roleId: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteRoleCommand(roleId));
  }
}
