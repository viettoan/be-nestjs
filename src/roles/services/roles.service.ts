import { Inject, Injectable } from '@nestjs/common';
import { RolesRepository } from '../../repositories/mongodb/roles.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../../entities/mongodb/role.entity';
import { CreateSearchLikeQueryUtil } from 'src/common/utils/create-search-like-query.util';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { User } from 'src/entities/mongodb/user.entity';
import { GetRolesWithPaginateDto } from '../dto/get-roles-with-paginate.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async store(role: CreateRoleDto, currentUser?: User): Promise<Role> {
    return await this.rolesRepository.store(role, currentUser);
  }

  async findWithPaginate(
    query: GetRolesWithPaginateDto,
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

  async update(
    roleId: string,
    role: UpdateRoleDto,
    currentUser?: User,
  ): Promise<Role> {
    return this.rolesRepository.update(roleId, role, currentUser);
  }

  async destroy(roleId: string): Promise<boolean> {
    return this.rolesRepository.delete(roleId);
  }
}
