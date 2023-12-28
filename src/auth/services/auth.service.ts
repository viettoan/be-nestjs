import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { User } from 'src/users/entities/mongodb/user.entity';
import { UsersRepositoryInterface } from 'src/users/interface/repositories/users.repository.interface';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { Session, SessionDocument } from '../entities/session.entity';
import { SessionsRepositoryInterface } from '../interfaces/repositories/session.repository.interface';
import { UserIsConfirmAccount } from 'src/users/enum/user-is-confirm-account.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private usersRepository: UsersRepositoryInterface,
    @Inject('SessionsRepositoryInterface')
    private sessionsRepository: SessionsRepositoryInterface,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginDto): Promise<User & { token: string }> {
    const user = await this.usersRepository.findOneByEmail(data.email);

    if (!user) {
      throw new BadRequestException('User khong ton tai');
    }

    if (user.isConfirmAccount != UserIsConfirmAccount.TRUE) {
      throw new BadRequestException('User chua xac thuc');
    }

    if (!(await this.compareBcryptPassword(data.password, user.password))) {
      throw new BadRequestException('Password khong chinh xac');
    }
    const token = await this.createAuthToken(user);

    return {
      ...user.toObject(),
      token,
    };
  }

  private async compareBcryptPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  private async createAuthToken(user: User): Promise<string> {
    const token = this.createSessionToken();
    const expiredAt = new Date(
      Date.now() +
        this.configService.getOrThrow<number>(
          'SESSION_EXPIRE_DURATION_IN_SECOND',
        ) *
          1000,
    );
    await this.createSession({ token, expiredAt, user: user._id });

    return token;
  }

  private createSessionToken(): string {
    return randomBytes(
      this.configService.getOrThrow<number>('SESSION_KEY_LENGTH_IN_BYTES'),
    ).toString('base64');
  }

  private async createSession(
    data: Partial<Session>,
  ): Promise<SessionDocument> {
    const session = await this.sessionsRepository.findOne({
      user: data.user,
    });

    if (session) {
      return this.sessionsRepository.update(session._id, { token: data.token });
    }
    return this.sessionsRepository.store(data);
  }
}
