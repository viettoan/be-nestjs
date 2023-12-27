import { ResourceActionPermission } from '../types/resouce-action-permission.type';
import { UserAware } from 'src/common/enitites/user-aware.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'roles',
  timestamps: true,
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
}

export const RoleSchema = SchemaFactory.createForClass(Role);
