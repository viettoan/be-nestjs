import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import { WinstonLogger } from './common/utils/winston-logger.util';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './common/exceptions/validation.exception';

async function bootstrap() {
  const logger = new WinstonLogger();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new MongoExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      transform: true,
      exceptionFactory: (errors) => {
        return new ValidationException(
          errors.map((error) => {
            return {
              [error.property]: {
                value: error.value,
                message: Object.values(error.constraints)[0],
              },
            };
          }),
        );
      },
    }),
  );
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
