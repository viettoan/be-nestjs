import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { BaseEntity } from 'src/common/enitites/base.entity';

export type SessionDocument = HydratedDocument<Session>;

@Schema({
  collection: 'sessions',
  timestamps: true,
})
export class Session extends BaseEntity {
  @Prop({
    type: 'string',
    required: true,
    index: true,
  })
  token: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  user: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
