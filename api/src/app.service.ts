import { Injectable } from '@nestjs/common';
import { redis } from './redis/redis';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async testRedis() {
    await redis.set('hello', 'world');

    const value = await redis.get('hello');

    return value;
  }
}
