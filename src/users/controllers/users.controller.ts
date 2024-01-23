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
  Res,
} from '@nestjs/common';
import { GetUsersWithPaginateDto } from '../dto/get-users-with-paginate.dto';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EXCEL_MIME_TYPE, USER } from 'src/common/constant/app.constant';
import { User } from '../../entities/mongodb/user.entity';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { CreateUserMultipartDto } from '../dto/create-user-multipart.dto';
import { UpdateUserMultipartDto } from '../dto/update-user-multipart.dto';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { ResourceType } from 'src/roles/enums/resource-type.enum';
import { ResourceAction } from 'src/roles/enums/resource-action.enum';
import { ExportUserDto } from '../dto/export-user.dto';
import { Response } from 'express';
import { Readable } from 'stream';
import { getExcelFileFilter } from 'src/common/utils/file-filter';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(200)
  @RequirePermission(ResourceType.USER, ResourceAction.CREATE)
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
    @CurrentUser() currentUser: User,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.store(user, avatar, currentUser);
  }

  @Get()
  @HttpCode(200)
  @RequirePermission(ResourceType.USER, ResourceAction.READ)
  async index(
    @Query() query: GetUsersWithPaginateDto,
  ): Promise<ResponsePaginationType<User>> {
    return await this.usersService.findWithPagination(query);
  }

  @Get('export')
  @RequirePermission(ResourceType.USER, ResourceAction.EXPORT)
  async export(@Query() query: ExportUserDto, @Res() res: Response) {
    const { buffer, fileName } = await this.usersService.export(query);
    res.setHeader('Content-Type', EXCEL_MIME_TYPE);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    Readable.from(buffer).pipe(res);
  }

  @Get(':userId')
  @HttpCode(200)
  @RequirePermission(ResourceType.USER, ResourceAction.READ)
  async show(@Param('userId') userId: string) {
    return await this.usersService.show(userId);
  }

  @Put(':userId')
  @HttpCode(200)
  @RequirePermission(ResourceType.USER, ResourceAction.UPDATE)
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
    @CurrentUser() currentUser: User,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(
      userId,
      user,
      avatar,
      currentUser,
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @Delete(':userId')
  @HttpCode(200)
  @RequirePermission(ResourceType.USER, ResourceAction.DELETE)
  async destroy(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
  ): Promise<boolean> {
    return await this.usersService.destroy(userId, currentUser);
  }

  @Post('import')
  @RequirePermission(ResourceType.USER, ResourceAction.IMPORT)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: getExcelFileFilter(),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  async import(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.import(file, currentUser);
  }
}
