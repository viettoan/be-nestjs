import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/mongodb/user.entity';
import { EmailService } from '../../email/services/email.service';
import { createBcryptHashPassword } from 'src/common/utils/helpers.util';
import { ListUserWithPaginateDto } from 'src/users/dto/user.dto';
import { USER } from 'src/common/constant/app.constant';
import { ConfigService } from '@nestjs/config';
import { getUrlFromStorage } from 'src/common/utils/get-url-from-storage.util';
import { UsersRepositoryInterface } from 'src/users/interface/repositories/users.repository.interface';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    private configService: ConfigService,
    @Inject('UsersRepositoryInterface')
    private usersRepository: UsersRepositoryInterface,
  ) {}

  async store(
    user: CreateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const dataCreate: Partial<User> = { ...user };
    dataCreate.password = await createBcryptHashPassword(user.password);

    if (avatar) {
      dataCreate.avatar = `${USER.AVATAR_PREFIX}/${avatar.filename}`;
    }
    const newUser = await this.usersRepository.store(dataCreate);

    this.emailService.sendEmailWithTemplate(
      user.email,
      'Welcome to Our Service',
      'welcome',
      {
        name: user.name,
      },
    );

    return newUser;
  }

  async findWithPagination(
    params: ListUserWithPaginateDto,
  ): Promise<ResponsePaginationType<User>> {
    const { limit, page, ...rest } = params;

    return this.usersRepository.paginate(rest, limit, page);
  }

  async show(userId: string) {
    const user = await this.usersRepository.findById(userId, { path: 'roles' });
    user.avatar = getUrlFromStorage(
      user.avatar,
      this.configService.get('STORAGE'),
    );

    return user;
  }

  async update(
    userId: string,
    user: UpdateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const dataUpdate: Partial<User> = { ...user };

    if (avatar) {
      dataUpdate.avatar = `${USER.AVATAR_PREFIX}/${avatar.filename}`;
    }

    if (user.password) {
      user.password = await createBcryptHashPassword(user.password);
    }
    return this.usersRepository.update(userId, dataUpdate);
  }

  async destroy(userId: string): Promise<boolean> {
    return await this.usersRepository.softDelete(userId);
  }
}
