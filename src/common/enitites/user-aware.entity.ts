import { User } from 'src/users/entities/mongodb/user.entity';
import { ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';

export class UserAware extends BaseEntity {
  @ManyToOne(() => User)
  createdBy?: User;

  @ManyToOne(() => User)
  updatedBy?: User;
}
