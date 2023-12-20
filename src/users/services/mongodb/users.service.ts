import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/mongodb/user.repository';
import { User } from '../../entities/mongodb/user.entity';
import { EmailService } from '../../../email/services/email.service';
import { createBcryptHashPassword } from 'src/common/utils/helpers.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}
  listWithPagination(
    limit: number = 10,
    page: number = 1,
    params: object = {},
  ): Promise<object> {
    return this.userRepository.paginate(limit, page, params);
  }
  show(userId: string): Promise<User | null> {
    return this.userRepository.findOneById(userId);
  }
  async store(user: User): Promise<boolean> {
    user.password = await createBcryptHashPassword(user.password);
    const newUser = await this.userRepository.insertOne(user);
    this.emailService.sendEmailWithTemplate(
      user.email,
      'Welcome to Our Service',
      'welcome',
      {
        name: user.name,
      },
    );
    return newUser.acknowledged;
  }
  async update(userId: string, user: User) {
    return await this.userRepository.updateById(userId, user);
  }
  async destroy(userId: string) {
    return await this.userRepository.deleteById(userId);
  }
}
