import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from '../transforms/toNumber.transform';
import { ApiProperty } from '@nestjs/swagger';
export class PaginationDto {
  @IsInt()
  @Min(1)
  @Transform(toNumber)
  @ApiProperty({
    default: 10,
    required: false,
    type: 'number',
  })
  limit: number = 10;
  @IsInt()
  @Min(1)
  @Transform(toNumber)
  @ApiProperty({
    default: 1,
    required: false,
    type: 'number',
  })
  page: number = 1;
}
