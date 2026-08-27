import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { redis } from 'src/redis/redis';

@Injectable()
export class RateLimitService {
  async check(key: string) {
    const result = await redis.eval(
      `
     local count = redis.call('INCR', KEYS[1])

     if count == 1 then
       redis.call('EXPIRE', KEYS[1], ARGV[1])
     end

     return count
     `,
      1,
      key,
      60,
    );

    if (typeof result !== 'number') {
      throw new Error('Unexpected Redis rate-limit response');
    }

    const count = result;

    if (count > 5) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return count;
  }
}
