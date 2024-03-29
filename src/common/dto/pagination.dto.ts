import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from '../transforms/to-number.transform';
import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @ApiProperty({
    default: 10,
    required: false,
    type: 'number',
  })
  @Transform(toNumber)
  limit: number = 10;
  @IsInt()
  @Min(1)
  @ApiProperty({
    default: 1,
    required: false,
    type: 'number',
  })
  @Transform(toNumber)
  page: number = 1;
}

export function PaginatedQuery<T>(
  classRef: Type<T>,
): Type<Partial<T> & PaginationDto>;

export function PaginatedQuery<T, K extends keyof T>(
  classRef: Type<T>,
  excludeFields: readonly K[],
): Type<Partial<Omit<T, K>> & PaginationDto>;

export function PaginatedQuery<T, K extends keyof T>(
  classRef: Type<T>,
  excludeFields?: readonly K[],
) {
  const partialType = PartialType(
    excludeFields ? OmitType(classRef, excludeFields) : classRef,
  );
  return IntersectionType(partialType, PaginationDto);
}
