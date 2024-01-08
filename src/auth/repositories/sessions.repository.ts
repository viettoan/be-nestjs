import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/mongodb/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../entities/session.entity';
import { SessionsRepositoryInterface } from '../interfaces/repositories/session.repository.interface';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';

@Injectable()
export class SessionsRepository
  extends BaseRepository<SessionDocument>
  implements SessionsRepositoryInterface
{
  constructor(
    @InjectModel(Session.name, MONGO_CONNECTION_NAME)
    protected model: Model<SessionDocument>,
  ) {
    super(model);
  }
}
