import { BaseEntity } from './base.entity';
import { ObjectId } from 'mongodb';
import { Prop } from '@nestjs/mongoose';

export class UserAware extends BaseEntity {
  @Prop({
    type: ObjectId,
    required: false,
  })
  createdById?: ObjectId;

  @Prop({
    type: ObjectId,
    required: false,
  })
  updatedById?: ObjectId;
}
