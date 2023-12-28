import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.entity';
import { SessionsRepository } from './repositories/sessions.repository';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'SessionsRepositoryInterface', useClass: SessionsRepository },
  ],
})
export class AuthModule {}
