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
  CreateOrUpdateUserDto,
} from '../dto/user.dto';
import { UsersService } from '../services/mongodb/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

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
    return await this.usersService.listWithPagination(
      +query.limit,
      +query.page,
    );
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
        destination: path.resolve('./storage/upload'),
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
  async store(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() user: CreateOrUpdateUserDto,
  ) {
    return await this.usersService.store(user);
  }

  @Put(':userId')
  @HttpCode(200)
  async update(
    @Param('userId') userId: string,
    @Body() user: CreateOrUpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(userId, user);

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
