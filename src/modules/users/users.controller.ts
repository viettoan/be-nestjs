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
} from '@nestjs/common';
import { Response } from 'express';
import {
  ListUserWithPaginateDto,
  CreateOrUpdateUserDto,
} from './dto/user.dto';
import { UsersService } from './services/mongodb/users.service';
import { responseSuccess } from '../../common/helpers';

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
    return response.json(responseSuccess(await this.usersService.show(userId)));
  }
  @Post()
  @HttpCode(200)
  async store(@Body() user: CreateOrUpdateUserDto, @Res() response: Response) {
    return response.json(responseSuccess(await this.usersService.store(user)));
  }
  @Put(':userId')
  @HttpCode(200)
  async update(
    @Param('userId') userId: string,
    @Body() user: CreateOrUpdateUserDto,
    @Res() response: Response,
  ) {
    const updatedUser = await this.usersService.update(userId, user);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return response.json(responseSuccess(updatedUser));
  }
  @Delete(':userId')
  @HttpCode(200)
  async destroy(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    return response.json(
      responseSuccess(await this.usersService.destroy(userId)),
    );
  }
}
