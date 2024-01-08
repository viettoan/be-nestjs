import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/mongodb/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { CreateRootUserCommand } from './commands/create-root-user.command';
import { CommandModule } from 'nestjs-command';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      MONGO_CONNECTION_NAME,
    ),
    CommandModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'UsersRepositoryInterface', useClass: UsersRepository },
    CreateRootUserCommand,
  ],
  exports: ['UsersRepositoryInterface'],
})
export class UsersModule {}
