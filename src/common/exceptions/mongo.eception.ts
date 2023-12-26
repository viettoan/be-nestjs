import { BadRequestException } from '@nestjs/common';

export class MongoException extends BadRequestException {
  constructor(
    public keyValue: object,
    public code: number,
    public message: string,
  ) {
    super();
  }
}
