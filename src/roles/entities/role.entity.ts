import { ResourceActionPermission } from '../types/resouce-action-permission.type';
import { UserAware } from 'src/common/enitites/user-aware.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  collection: 'roles',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Role extends UserAware {
  @Prop({
    required: true,
    unique: true,
  })
  code: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: false,
  })
  description: string;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: false,
    type: Schema,
  })
  resourceActionPermission?: ResourceActionPermission;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  // })
  // @Type(() => User)
  // users?: User;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'roles',
});
