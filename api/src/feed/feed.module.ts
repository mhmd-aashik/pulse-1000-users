import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';

@Module({
  imports: [RateLimitModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
