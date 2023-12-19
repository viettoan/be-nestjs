import { IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { number } from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsInt({ message: 'Limit phải là kiểu số' })
  @Transform(({ value }) => (+value ? +value : value))
  @Type(() => number)
  @ApiProperty({
    default: 20,
    required: false,
    type: 'number',
  })
  limit?: number;
  @IsInt({ message: 'Page phải là kiểu số' })
  @Transform(({ value }) => (+value ? +value : value))
  @ApiProperty({
    default: 1,
    required: false,
    type: 'number',
  })
  page?: number;
}
