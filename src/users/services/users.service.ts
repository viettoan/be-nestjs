import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/mongodb/user.entity';
import { EmailService } from '../../email/services/email.service';
import { createBcryptHashPassword } from 'src/common/utils/helpers.util';
import { FindUserDto } from 'src/users/dto/find-user.dto';
import { QUERY_BATCHING_SIZE, USER } from 'src/common/constant/app.constant';
import { ConfigService } from '@nestjs/config';
import { getUrlFromStorage } from 'src/common/utils/get-url-from-storage.util';
import { UsersRepositoryInterface } from 'src/users/interface/repositories/users.repository.interface';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ExportUserDto } from '../dto/export-user.dto';
import XlsxTemplate from 'xlsx-template';
import { readFileSync } from 'fs';
import path from 'path';
import { UsersExportType } from '../types/UsersExport.type';
import moment from 'moment';

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
    params: FindUserDto,
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

  async export(query: ExportUserDto) {
    const fileExport = new XlsxTemplate(
      readFileSync(path.resolve('./src/users/templates/DanhsachUsers.xlsx')),
    );
    const usersData: UsersExportType[] = [];
    const data = await this.usersRepository.findWithBatch(
      query,
      QUERY_BATCHING_SIZE,
    );
    data.forEach((users: UsersExportType[]) => {
      users.forEach((user: UsersExportType) => {
        usersData.push(user);
      });
    });
    let order = 0;
    fileExport.substitute(1, {
      data: usersData.map((user) => {
        order += 1;

        return {
          order,
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
      }),
    });
    const current = moment().format('DDMMYYYY');

    return {
      buffer: fileExport.generate({ type: 'nodebuffer' }) as Buffer,
      fileName: `DanhsachUsers_${current}.xlsx`,
    };
  }
}
