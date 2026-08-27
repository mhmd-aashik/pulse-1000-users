import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { redis } from 'src/redis/redis';

@Injectable()
export class RateLimitService {
  async check(key: string) {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60);
    }

    if (count > 5) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return count;
  }
}
