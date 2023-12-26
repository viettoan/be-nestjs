import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';
import { FindRoleQueryDto } from '../dto/find-role-query.dto';
import { CreateSearchLikeQueryUtil } from 'src/common/utils/create-search-like-query.util';

@Injectable()
export class RolesService {
  constructor(private roleRepository: RoleRepository) {}

  async store(role: CreateRoleDto): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  async find(query: FindRoleQueryDto) {
    const { limit, page, ...rest } = query;
    const roles = this.roleRepository.paginate(limit, page, {
      ...rest,
      name: CreateSearchLikeQueryUtil(rest.name),
      code: CreateSearchLikeQueryUtil(rest.code),
    });

    return roles;
  }
}
