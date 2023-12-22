import { UserAware } from 'src/common/enitites/user-aware.entity';
import { UserIsConfirmAccount } from 'src/users/enum/user-is-confirm-account.enum';
import { Entity, Column, Index } from 'typeorm';

@Entity('users')
export class User extends UserAware {
  @Column()
  name: string;

  @Column()
  @Index({
    unique: true,
  })
  email: string;

  @Column()
  @Index({
    unique: true,
  })
  phone: string;

  @Column()
  avatar?: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    default: UserIsConfirmAccount.FALSE,
  })
  isConfirmAccount?: UserIsConfirmAccount;
}
