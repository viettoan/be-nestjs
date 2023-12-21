import { User } from 'src/users/entities/mongodb/user.entity';
import { ManyToOne } from 'typeorm';

export class BaseEntity {
  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  updatedBy: User;
}
