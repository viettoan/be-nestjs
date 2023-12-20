import { IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { number } from 'joi';

export class PaginationDto {
  @IsInt({ message: 'Limit phải là kiểu số' })
  @Transform(({ value }) => (+value ? +value : value))
  @Type(() => number)
  limit?: number;
  @IsInt({ message: 'Page phải là kiểu số' })
  @Transform(({ value }) => (+value ? +value : value))
  page?: number;
}
