import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { capitalizeFirstLetter } from '../utils/helpers.util';
import { MongoException } from '../exceptions/mongo.eception';

@Catch(MongoException)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const data = {
      errors: [],
      status: HttpStatus.BAD_REQUEST,
      message: '',
      now: new Date(),
    };
    const [path, value] = Object.entries(exception.keyValue)[0];

    switch (exception.code) {
      case 11000:
        try {
          data.errors.push({
            [path]: {
              value,
              message: capitalizeFirstLetter(path) + ' đã tồn tại',
            },
          });
        } catch (e) {
          data.message = exception.message;
        }
        break;
      default:
        data.message = exception.message;
    }

    return response.status(exception.getStatus()).json(data);
  }
}
