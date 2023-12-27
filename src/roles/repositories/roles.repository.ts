import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/mongodb/base.repository';
import { Role } from '../entities/role.entity';
import { RolesRepositoryInterface } from '../interfaces/repositories/roles.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesRepository
  extends BaseRepository<Role>
  implements RolesRepositoryInterface
{
  constructor(
    @InjectModel(Role.name)
    protected model: Model<Role>,
  ) {
    super(model);
  }
}
