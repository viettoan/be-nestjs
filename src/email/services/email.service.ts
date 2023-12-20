import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private templatesPath: string = './src/email/templates';

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_POST'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmailWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ): Promise<void> {
    const templatePath = path.resolve(
      `${this.templatesPath}/${templateName}.hbs`,
    );
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(context);
    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
