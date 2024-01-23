import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from '../../interface/repositories/mongodb/users.repository.interface';
import { ConfigService } from '@nestjs/config';
import { Command } from 'nestjs-command';
import { createBcryptHashPassword } from 'src/common/utils/helpers.util';
import { UserIsConfirmAccount } from '../enum/user-is-confirm-account.enum';

@Injectable()
export class CreateRootUserCommand {
  constructor(
    @Inject('UsersRepositoryInterface')
    private usersRepository: UsersRepositoryInterface,
    private configService: ConfigService,
  ) {}

  @Command({
    command: 'create:root-user',
    describe: 'Create root user',
  })
  async create() {
    const user = await this.usersRepository.store({
      name: this.configService.getOrThrow<string>('ROOT_USER_INITIAL_NAME'),
      email: this.configService.getOrThrow<string>('ROOT_USER_INITIAL_EMAIL'),
      password: await createBcryptHashPassword(
        this.configService.getOrThrow<string>('ROOT_USER_INITIAL_PASSWORD'),
      ),
      phone: this.configService.getOrThrow<string>('ROOT_USER_INITIAL_PHONE'),
      isConfirmAccount: UserIsConfirmAccount.TRUE,
    });
    console.log('Root User create successfully!', user);
  }
}
