import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { RateLimitModule } from 'src/rate-limit/rate-limit.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RateLimitModule, AuthModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
