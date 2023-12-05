import { Global, Module } from '@nestjs/common';
import { UserRepository } from './mongodb/user.repository';

@Global()
@Module({
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}
