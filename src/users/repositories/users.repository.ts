import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../entities/mongodb/user.entity';
import { BaseRepository } from '../../common/repositories/mongodb/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { UsersRepositoryInterface } from 'src/users/interface/repositories/users.repository.interface';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';

@Injectable()
export class UsersRepository
  extends BaseRepository<UserDocument>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectModel(User.name, MONGO_CONNECTION_NAME)
    protected model: Model<UserDocument>,
  ) {
    super(model);
  }

  async findOneByEmail(
    email: string,
  ): Promise<Document<unknown, object, User> & User & { _id: Types.ObjectId }> {
    return this.getModel().findOne({ email });
  }
}
