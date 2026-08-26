import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  follow(@Body() body: CreateFollowDto) {
    return this.followsService.follow(body);
  }

  @Get(':userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(Number(userId));
  }
}
