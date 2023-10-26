import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/mongodb/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   host: '192.168.12.22',
    //   port: 3307,
    //   username: 'vuihoc',
    //   password: '123456',
    //   database: 'vh_exam',
    //   entities: [User],
    // }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://viettoan290696:ToanPham290696@cluster0.ypvxrm7.mongodb.net/base_admin?retryWrites=true&w=majority',
      entities: [User],
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      name: 'mongodbConnection',
    }),
    MulterModule.register({
      dest: './storage/upload',
    }),
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
