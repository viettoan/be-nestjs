import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
  ) {}

  async set(key: string, value: string, expirationSecond: number) {
    await this.client.set(key, value, 'EX', expirationSecond);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
