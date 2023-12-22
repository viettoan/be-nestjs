import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { capitalizeFirstLetter } from '../utils/helpers.util';

@Catch(MongoServerError)
export class MongoErrorFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const data = {
      errors: [],
      status: HttpStatus.BAD_REQUEST,
      message: '',
      now: new Date(),
    };

    switch (exception.code) {
      case 11000:
        try {
          let keyValueString = exception.message.match(/{.+}/g)[0];
          keyValueString = keyValueString.substring(
            1,
            keyValueString.length - 1,
          );
          let [key, value] = keyValueString.split(':');
          value = value.trim();
          key = key.trim();
          data.errors.push({
            [key]: {
              value: value.substring(1, value.length - 1),
              message: capitalizeFirstLetter(key) + ' đã tồn tại',
            },
          });
        } catch (e) {
          data.message = exception.message;
        }
        break;
      default:
        data.message = exception.message;
    }

    return response.status(HttpStatus.BAD_REQUEST).json(data);
  }
}
