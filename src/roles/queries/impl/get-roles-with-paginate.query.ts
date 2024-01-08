import { GetRolesWithPaginateDto } from 'src/roles/dto/get-roles-with-paginate.dto';

export class GetRolesWithPaginateQuery {
  constructor(public readonly data: GetRolesWithPaginateDto) {}
}
