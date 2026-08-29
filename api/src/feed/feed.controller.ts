import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { RateLimitService } from 'src/rate-limit/rate-limit.service';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Get(':userId')
  async getFeed(
    @Param('userId') userId: string,
    @Query('limit')
    limit?: string,
    @Query('cursor')
    cursor?: string,
  ) {
    await this.rateLimitService.check(`rate:feed:${userId}`);

    return this.feedService.getFeed(
      Number(userId),
      limit ? Number(limit) : 20,
      cursor,
    );
  }
}
