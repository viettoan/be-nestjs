import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id?: ObjectId;
  @Column()
  name: string;
  email: string;
  @Column()
  phone: string;
  @Column()
  avatar?: string;
  @Column()
  password: string;
  @Column()
  level: number;
  @Column()
  is_confirm_account?: number;
  @ObjectIdColumn()
  created_by?: ObjectId;
  @ObjectIdColumn()
  updated_by?: ObjectId;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;
}
