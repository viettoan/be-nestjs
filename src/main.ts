import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/validations/validation.pipe';
import { ValidationFilter } from './common/filters/validation.filter';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import { WinstonLogger } from './common/utils/winston-logger.util';
import { MongoErrorFilter } from './common/filters/mongo-error.filter';

async function bootstrap() {
  const logger = new WinstonLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.useGlobalFilters(new MongoErrorFilter(), new ValidationFilter());
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BE NestJS')
    .setDescription('BE NestJS - ToanPV')
    .setVersion('0.1')
    .addBearerAuth()
    .addBasicAuth()
    .setExternalDoc('Postman collection', '/docs-json')
    .addServer(`http://localhost:3000`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const port = 3000;
  await app.listen(port);
  logger.log(`Bootstrap app successfully, server listening on port: ${port}`);
}
bootstrap().catch((error: Error) => {
  new WinstonLogger().error(error.message, error);
  process.exit(1);
});
