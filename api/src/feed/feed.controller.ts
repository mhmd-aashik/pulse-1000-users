import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { RateLimitService } from 'src/rate-limit/rate-limit.service';
import { KeycloakAuthGuard } from 'src/auth/keycloak-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @UseGuards(KeycloakAuthGuard)
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

  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/test')
  adminTest() {
    return {
      message: 'Admin access granted',
    };
  }
}
