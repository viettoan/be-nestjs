import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/mongodb/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from '../../../common/repositories/mongodb/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectDataSource('mongodbConnection') dataSource: DataSource) {
    super(User, dataSource);
  }
}
