import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const validationErrors = errors.map((error) => {
        return {
          [error.property]: {
            value: error.value,
            message: Object.values(error.constraints).join(''),
          },
        };
      });
      throw new ValidationException(validationErrors);
    }
    return value;
  }
  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
