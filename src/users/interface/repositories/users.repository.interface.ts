import { BaseRepositoryInterface } from 'src/common/Interfaces/repositories/mongodb/base.repository.interface';
import { User } from 'src/users/entities/mongodb/user.entity';

export interface UsersRepositoryInterface
  extends BaseRepositoryInterface<User> {}
