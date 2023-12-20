import {
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ObjectIdColumn()
  _id?: ObjectId;

  @ObjectIdColumn()
  createdBy?: ObjectId;

  @ObjectIdColumn()
  updatedBy?: ObjectId;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
