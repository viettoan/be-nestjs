import Joi from 'joi';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  address: Joi.string().required(),
}).options({ abortEarly: false, allowUnknown: true });

export class CreateOrUpdateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    required: true,
    type: 'string',
    maxLength: 255,
  })
  name: string;
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    required: true,
    type: 'string',
    maxLength: 255,
  })
  email: string;
  @IsString()
  @Matches(
    /^(0|\+84)((3[2-9])|(4[0-9])|(5[25689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/u,
  )
  @ApiProperty({
    required: true,
    type: 'string',
  })
  phone: string;
  @IsString()
  @MinLength(6)
  @MaxLength(25)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  password: string;
  @IsInt()
  @Transform(({ value }) => (+value ? +value : value))
  @IsIn([1, 2])
  @ApiProperty({
    required: true,
    type: 'number',
  })
  level: number;
}

export class ListUserWithPaginateDto extends PaginationDto {}
