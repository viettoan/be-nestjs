import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/mongodb/user.repository';
import { User } from '../../entities/mongodb/user.entity';
import { EmailService } from '../../../email/services/email.service';
import { createBcryptHashPassword } from 'src/common/utils/helpers.util';
import { CreateUserDto, UpdateUserDto } from 'src/users/dto/user.dto';
import { USER } from 'src/common/constant/app.constant';
import { ConfigService } from '@nestjs/config';
import { getUrlFromStorage } from 'src/common/utils/get-url-from-storage.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private configService: ConfigService,
  ) {}
  async listWithPagination(
    limit: number = 10,
    page: number = 1,
    params: object = {},
  ): Promise<object> {
    const users = await this.userRepository.paginate(limit, page, params);
    users.data.forEach((user) => {
      user.avatar = getUrlFromStorage(
        user.avatar,
        this.configService.get('STORAGE'),
      );
    });

    return users;
  }
  async show(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOneById(userId);
    user.avatar = getUrlFromStorage(
      user.avatar,
      this.configService.get('STORAGE'),
    );

    return user;
  }
  async store(
    user: CreateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    user.password = await createBcryptHashPassword(user.password);
    const newUser = await this.userRepository.save({
      ...user,
      avatar: `${USER.AVATAR_PREFIX}/${avatar.filename}`,
    });

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
  async update(
    userId: string,
    user: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    const dataUpdate: Partial<User> = { ...user };

    if (avatar) {
      dataUpdate.avatar = `${USER.AVATAR_PREFIX}/${avatar.filename}`;
    }

    if (user.password) {
      user.password = await createBcryptHashPassword(user.password);
    }
    const userUpdated = await this.userRepository.updateById(
      userId,
      dataUpdate,
    );

    if (!userUpdated) {
      return false;
    }

    return true;
  }

  async destroy(userId: string) {
    return await this.userRepository.deleteById(userId);
  }
}
