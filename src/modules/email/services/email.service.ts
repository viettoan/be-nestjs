import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private templatesPath: string = './src/views/email_templates';

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get('email');
    this.transporter = createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      auth: {
        user: emailConfig.username,
        pass: emailConfig.password,
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
      from: this.configService.get('email.from'),
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
