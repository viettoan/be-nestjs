import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Role, RoleDocument } from '../../entities/mongodb/role.entity';
import { RolesRepositoryInterface } from '../../interface/repositories/mongodb/roles.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';

@Injectable()
export class RolesRepository
  extends BaseRepository<RoleDocument>
  implements RolesRepositoryInterface
{
  constructor(
    @InjectModel(Role.name, MONGO_CONNECTION_NAME)
    protected model: Model<RoleDocument>,
  ) {
    super(model);
  }
}
