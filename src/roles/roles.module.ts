import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RolesRepository } from '../repositories/mongodb/roles.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../entities/mongodb/role.entity';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries/handlers';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { RoleSagas } from './sagas/role.sagas';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature(
      [{ name: Role.name, schema: RoleSchema }],
      MONGO_CONNECTION_NAME,
    ),
  ],
  controllers: [RolesController],
  providers: [
    { provide: 'RolesRepositoryInterface', useClass: RolesRepository },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    RoleSagas,
  ],
})
export class RolesModule {}
