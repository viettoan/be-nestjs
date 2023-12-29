import { ConsoleLogger } from '@nestjs/common';
import { config } from 'dotenv';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Logger as TypeormLogger } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpLoggerContext } from './http-logger-context.util';
import { LOG_DATE_FORMAT } from '../constant/app.constant';
import moment from 'moment';

config();

const timestampWithTimezone = winston.format((info) => {
  return {
    time: moment().format(LOG_DATE_FORMAT),
    ...info,
  };
});

const customFormat = winston.format.printf(
  (info: winston.Logform.TransformableInfo & { time: string }) => {
    return `[${info.time}] ${JSON.stringify(info)}`;
  },
);

function createDailyRotateTransport(logLevel: string) {
  return new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: process.env.LOG_MAX_FILES || 100,
    maxSize: process.env.LOG_MAX_SIZE || '100mb',
    dirname: 'logs',
    format: winston.format.combine(timestampWithTimezone(), customFormat),
    level: logLevel,
    filename: `%DATE%-${logLevel}.log`,
  });
}

function getLogInfoObject(optionalParams: unknown[]) {
  const [first, ...params] = optionalParams;
  if (first instanceof HttpLoggerContext) {
    return {
      ...first.getHttpInfoObject(),
      params,
    };
  }
  return {
    params: optionalParams,
  };
}

export class WinstonLogger extends ConsoleLogger implements TypeormLogger {
  private winstonInstance;
  private configService = new ConfigService();

  constructor() {
    super('app', {
      timestamp: true,
    });
    this.winstonInstance = winston.createLogger({
      level: 'info',
      exitOnError: false,
      defaultMeta: { service: 'be-nestjs' },
      transports: [
        createDailyRotateTransport('error'),
        createDailyRotateTransport('info'),
      ],
    });
  }

  log(message: string, ...optionalParams: unknown[]) {
    const logInfoObject = getLogInfoObject(optionalParams);
    super.log(message, JSON.stringify(logInfoObject));
    this.winstonInstance.info({
      message,
      ...logInfoObject,
    });
  }

  error(message: string, ...optionalParams: unknown[]) {
    const logInfoObject = getLogInfoObject(optionalParams);
    super.error(message, JSON.stringify(logInfoObject));
    this.winstonInstance.error({
      message,
      ...logInfoObject,
    });
  }

  warn(message: string, ...optionalParams: unknown[]) {
    const logInfoObject = getLogInfoObject(optionalParams);
    super.warn(message, JSON.stringify(logInfoObject));
    this.winstonInstance.warn({
      message,
      ...logInfoObject,
    });
  }

  debug(message: string, ...optionalParams: unknown[]) {
    const logInfoObject = getLogInfoObject(optionalParams);
    super.debug(message, JSON.stringify(logInfoObject));
    this.winstonInstance.debug({
      message,
      ...logInfoObject,
    });
  }

  verbose(message: string, ...optionalParams: unknown[]) {
    const logInfoObject = getLogInfoObject(optionalParams);
    super.verbose(message, JSON.stringify(logInfoObject));
    this.winstonInstance.verbose({
      message,
      ...logInfoObject,
    });
  }

  logQuery(query: string, parameters?: unknown[] | undefined) {
    if (this.configService.get<string>('QUERY_DEBUG') === 'true') {
      this.log(`Typeorm query: ${query}`, parameters);
    }
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[] | undefined,
  ) {
    this.error(`Typeorm error, query: ${query}`, parameters, error);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.warn(`[${time} ms] Typeorm slow query: ${query}`, parameters);
  }

  logSchemaBuild() {}

  logMigration() {}
}
