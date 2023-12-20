import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();

    return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: exception.validationErrors,
    });
  }
}
