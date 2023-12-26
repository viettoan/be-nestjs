import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
  })
  deletedAt: Date;
}
