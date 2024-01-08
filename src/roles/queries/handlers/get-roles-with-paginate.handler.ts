import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RolesRepository } from 'src/roles/repositories/roles.repository';
import { Role } from 'src/roles/entities/role.entity';
import { GetRolesWithPaginateQuery } from '../impl/get-roles-with-paginate.query';
import { CreateSearchLikeQueryUtil } from 'src/common/utils/create-search-like-query.util';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';

@QueryHandler(GetRolesWithPaginateQuery)
export class GetRolesWithPaginateHandler
  implements IQueryHandler<GetRolesWithPaginateQuery>
{
  constructor(
    @Inject('RolesRepositoryInterface')
    private rolesRepository: RolesRepository,
  ) {}

  async execute(
    query: GetRolesWithPaginateQuery,
  ): Promise<ResponsePaginationType<Role>> {
    const { data } = query;
    const { limit, page, ...rest } = data;

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
}
