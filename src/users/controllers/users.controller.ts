import {
  Controller,
  Get,
  HttpCode,
  Query,
  Param,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ListUserWithPaginateDto,
  CreateUserDto,
  UpdateUserDto,
  CreateUserMultipartDto,
  UpdateUserMultipartDto,
} from '../dto/user.dto';
import { UsersService } from '../services/mongodb/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { USER } from 'src/common/constant/app.constant';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get()
  @HttpCode(200)
  async index(@Query() query: ListUserWithPaginateDto): Promise<object> {
    return await this.usersService.listWithPagination(query.limit, query.page);
  }

  @Get(':userId')
  @HttpCode(200)
  async show(@Param('userId') userId: string) {
    return await this.usersService.show(userId);
  }

  @Post()
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: path.resolve('./storage' + USER.AVATAR_PREFIX),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateUserMultipartDto,
  })
  async store(
    @Body() user: CreateUserMultipartDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return await this.usersService.store(user, avatar);
  }

  @Put(':userId')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: path.resolve('./storage' + USER.AVATAR_PREFIX),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUserMultipartDto,
  })
  async update(
    @Param('userId') userId: string,
    @Body() user: UpdateUserMultipartDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.update(userId, user, avatar);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @Delete(':userId')
  @HttpCode(200)
  async destroy(@Param('userId') userId: string) {
    return await this.usersService.destroy(userId);
  }
}
