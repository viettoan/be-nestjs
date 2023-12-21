import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { ResourceActionPermission } from '../types/resouce-action-permission.type';
import { User } from '../../users/entities/mongodb/user.entity';
import { BaseEntity } from 'src/common/enitites/base.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    nullable: false,
  })
  @Index({
    unique: true,
  })
  code: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  resourceActionPermission: ResourceActionPermission;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'role_users',
  })
  users: User[];
}
