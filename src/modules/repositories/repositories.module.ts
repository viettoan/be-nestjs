import { Module } from '@nestjs/common';
import { UserRepository } from './mongodb/user.repository';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}
