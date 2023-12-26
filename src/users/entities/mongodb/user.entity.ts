import { UserIsConfirmAccount } from 'src/users/enum/user-is-confirm-account.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserAware } from 'src/common/enitites/user-aware.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends UserAware {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  phone: string;

  @Prop({
    type: String,
    required: false,
  })
  avatar?: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Number,
    default: UserIsConfirmAccount.FALSE,
    enum: UserIsConfirmAccount,
  })
  isConfirmAccount?: UserIsConfirmAccount;
}

export const UserSchema = SchemaFactory.createForClass(User);
