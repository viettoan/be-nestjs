import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserMultipartDto extends UpdateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  avatar?: Express.Multer.File;
}
