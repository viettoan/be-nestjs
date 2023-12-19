import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/mongodb/user.entity';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.validation';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './common/interceptors/global.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      },
    }),
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
      url: 'mongodb://127.0.0.1:27017/base?retryWrites=true&w=majority',
      entities: [User],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      name: 'mongodbConnection',
    }),
    EmailModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
