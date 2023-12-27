import { BaseRepositoryInterface } from 'src/common/Interfaces/repositories/mongodb/base.repository.interface';
import { Role } from 'src/roles/entities/role.entity';

export interface RolesRepositoryInterface
  extends BaseRepositoryInterface<Role> {}
