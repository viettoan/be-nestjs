import Joi from 'joi';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  address: Joi.string().required(),
}).options({ abortEarly: false, allowUnknown: true });

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @Matches(
    /^(0|\+84)((3[2-9])|(4[0-9])|(5[25689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/u,
  )
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(25)
  password: string;
}

export class CreateUserMultipartDto extends CreateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  avatar?: Express.Multer.File;
}

export class UpdateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  name: string;

  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  email: string;

  @IsString()
  @Matches(
    /^(0|\+84)((3[2-9])|(4[0-9])|(5[25689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/u,
  )
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  phone: string;

  @IsString()
  @MinLength(6)
  @MaxLength(25)
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  password: string;
}

export class UpdateUserMultipartDto extends UpdateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  avatar?: Express.Multer.File;
}

export class ListUserWithPaginateDto extends PaginationDto {}
