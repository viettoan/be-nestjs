import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './services/mongodb/users.service';
import { EmailModule } from '../email/email.module';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [EmailModule, RepositoriesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
