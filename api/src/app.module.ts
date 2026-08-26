import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { FollowsModule } from './follows/follows.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PostsModule,
    FollowsModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
