import {
  Controller,
  Get,
  Res,
  HttpCode,
  Query,
  Param,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ListUserWithPaginateDto, CreateOrUpdateUserDto } from './dto/user.dto';
import { UsersService } from './services/mongodb/users.service';
import { responseErrors, responseSuccess } from '../../common/helpers';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async index(
    @Query() query: ListUserWithPaginateDto,
    @Res() response: Response,
  ): Promise<object> {
    return response.json(
      responseSuccess(
        await this.usersService.listWithPagination(+query.limit, +query.page),
      ),
    );
  }

  @Get(':userId')
  @HttpCode(200)
  async show(@Param('userId') userId: string, @Res() response: Response) {
    try {
      return response.json(
        responseSuccess(await this.usersService.show(userId)),
      );
    } catch (e) {
      return response.json(responseErrors(e, e.statusCode));
    }
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
    @Res() response: Response,
  ) {
    try {
      return response.json(
        responseSuccess(await this.usersService.store(user)),
      );
    } catch (e) {
      return response.json(responseErrors(e, e.statusCode));
    }
  }

  @Put(':userId')
  @HttpCode(200)
  async update(
    @Param('userId') userId: string,
    @Body() user: CreateOrUpdateUserDto,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.usersService.update(userId, user);

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return response.json(responseSuccess(updatedUser));
    } catch (e) {
      return response.json(responseErrors(e, e.statusCode));
    }
  }

  @Delete(':userId')
  @HttpCode(200)
  async destroy(@Param('userId') userId: string, @Res() response: Response) {
    try {
      return response.json(
        responseSuccess(await this.usersService.destroy(userId)),
      );
    } catch (e) {
      return response.json(responseErrors(e, e.statusCode));
    }
  }
}
