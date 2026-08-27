import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { FeedService } from './feed.service';
import type { Request } from 'express';
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
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Req() req: Request,
  ) {
    const ip = req.ip;

    await this.rateLimitService.check(`rate:feed:${ip}`);

    return this.feedService.getFeed(
      Number(userId),
      limit ? Number(limit) : 20,
      cursor,
    );
  }
}
