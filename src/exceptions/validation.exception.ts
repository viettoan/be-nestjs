import { UnprocessableEntityException } from '@nestjs/common';

interface ErrorProperty {
  value: any;
  message: string;
}

interface Error {
  [key: string]: ErrorProperty;
}

export class ValidationException extends UnprocessableEntityException {
  constructor(public validationErrors: Error[]) {
    super();
  }
}
