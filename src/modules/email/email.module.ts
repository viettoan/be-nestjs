import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
