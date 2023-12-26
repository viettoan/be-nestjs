import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/mongodb/base.repository.bk';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(@InjectDataSource('mongodbConnection') dataSource: DataSource) {
    super(Role, dataSource);
  }
}
