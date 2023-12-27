import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../entities/mongodb/user.entity';
import { BaseRepository } from '../../common/repositories/mongodb/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepositoryInterface } from 'src/users/interface/repositories/users.repository.interface';

@Injectable()
export class UsersRepository
  extends BaseRepository<UserDocument>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    protected model: Model<UserDocument>,
  ) {
    super(model);
  }
}
