import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export function getUrlFromStorage(file: string, storage: string = 'disk') {
  switch (storage) {
    case 'disk':
      return `${configService.get('APP_URL')}:${configService.get(
        'PORT',
      )}${file}`;
    default:
      return file;
  }
}
