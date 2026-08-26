import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { db } from 'src/db/db';
import { follows, posts } from 'src/db/schema';

@Injectable()
export class FeedService {
  async getFeed(userId: number) {
    return db
      .select({
        id: posts.id,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .innerJoin(follows, eq(posts.userId, follows.followingId))
      .where(eq(follows.followerId, userId))
      .orderBy(desc(posts.createdAt));
  }
}
