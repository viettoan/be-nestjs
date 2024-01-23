import { BaseRepositoryInterface } from 'src/interface/repositories/mongodb/base.repository.interface';
import { RoleDocument } from 'src/entities/mongodb/role.entity';

export interface RolesRepositoryInterface
  extends BaseRepositoryInterface<RoleDocument> {}
