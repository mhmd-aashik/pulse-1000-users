import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get(':userId')
  getFeed(
    @Param('userId') userId: string,
    @Query('limit')
    limit?: string,
    @Query('cursor')
    cursor?: string,
  ) {
    return this.feedService.getFeed(
      Number(userId),
      limit ? Number(limit) : 20,
      cursor,
    );
  }
}
