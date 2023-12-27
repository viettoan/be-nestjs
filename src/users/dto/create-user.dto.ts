import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { toArray } from 'src/common/transforms/to-array.transform';

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

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => toArray({ value }))
  roles?: string[];
}
