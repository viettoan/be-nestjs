import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  async store() {}
}
