import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('e_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  user_name: string;
  @Column()
  gender: number;
  @Column()
  avatar: string;
  @Column()
  mobile: string;
}
