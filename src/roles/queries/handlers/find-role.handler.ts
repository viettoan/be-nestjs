import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRoleQuery } from '../impl/find-role.query';
import { Inject } from '@nestjs/common';
import { RolesRepository } from 'src/roles/repositories/roles.repository';
import { Role } from 'src/roles/entities/role.entity';

@QueryHandler(FindRoleQuery)
export class FindRoleHandler implements IQueryHandler<FindRoleQuery> {
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async execute(query: FindRoleQuery): Promise<Role> {
    const { _id } = query;

    return this.rolesRepository.findById(_id);
  }
}
