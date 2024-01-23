import { BaseRepositoryInterface } from 'src/interface/repositories/mongodb/base.repository.interface';
import { UserDocument } from 'src/entities/mongodb/user.entity';

export interface UsersRepositoryInterface
  extends BaseRepositoryInterface<UserDocument> {
  findOneByEmail(email: string): Promise<UserDocument>;
}
