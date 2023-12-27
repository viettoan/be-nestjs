import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.validation';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './common/interceptors/global.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolesModule } from './roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
    }),
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
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: 'mongodb://127.0.0.1:27017/base?retryWrites=true&w=majority',
    //   entities: [User, Role],
    //   ssl: false,
    //   useUnifiedTopology: true,
    //   useNewUrlParser: true,
    //   synchronize: true,
    //   autoLoadEntities: true,
    //   name: 'mongodbConnection',
    // }),
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017/base?retryWrites=true&w=majority',
      {
        autoIndex: true,
      },
    ),
    EmailModule,
    UsersModule,
    RolesModule,
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
