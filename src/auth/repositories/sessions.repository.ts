import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/mongodb/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../entities/session.entity';
import { SessionsRepositoryInterface } from '../interfaces/repositories/session.repository.interface';

@Injectable()
export class SessionsRepository
  extends BaseRepository<SessionDocument>
  implements SessionsRepositoryInterface
{
  constructor(
    @InjectModel(Session.name)
    protected model: Model<SessionDocument>,
  ) {
    super(model);
  }
}
