import { Inject, Injectable } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';
import { FindRoleQueryDto } from '../dto/find-role-query.dto';
import { CreateSearchLikeQueryUtil } from 'src/common/utils/create-search-like-query.util';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async store(role: CreateRoleDto): Promise<Role> {
    return await this.rolesRepository.store(role);
  }

  async findWithPaginate(
    query: FindRoleQueryDto,
  ): Promise<ResponsePaginationType<Role>> {
    const { limit, page, ...rest } = query;

    return this.rolesRepository.paginate(
      {
        ...rest,
        name: CreateSearchLikeQueryUtil(rest.name),
        code: CreateSearchLikeQueryUtil(rest.code),
      },
      limit,
      page,
    );
  }

  async show(roleId: string): Promise<Role> {
    return this.rolesRepository.findById(roleId);
  }

  async update(roleId: string, role: UpdateRoleDto): Promise<Role> {
    return this.rolesRepository.update(roleId, role);
  }

  async destroy(roleId: string): Promise<boolean> {
    return this.rolesRepository.delete(roleId);
  }
}
