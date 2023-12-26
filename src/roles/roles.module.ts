import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { RoleRepository } from './repositories/role.repository';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
})
export class RolesModule {}
