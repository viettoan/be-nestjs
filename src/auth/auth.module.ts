import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.entity';
import { SessionsRepository } from './repositories/sessions.repository';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { BearerStrategy } from './strategies/bearer.startegy';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Session.name, schema: SessionSchema }],
      MONGO_CONNECTION_NAME,
    ),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'SessionsRepositoryInterface', useClass: SessionsRepository },
    BearerStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
