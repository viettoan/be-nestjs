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
        const [path, value] = Object.entries(exception.keyValue)[0];

        data.errors.push({
          [path]: {
            value,
            message: capitalizeFirstLetter(path) + ' đã tồn tại',
          },
        });
        break;
      default:
        data.message = exception.message;
    }

    return response.status(HttpStatus.BAD_REQUEST).json(data);
  }
}
