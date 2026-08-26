import { Injectable } from '@nestjs/common';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { db } from '../db/db';
import { follows, posts } from '../db/schema';
import { redis } from 'src/redis/redis';

@Injectable()
export class FeedService {
  async getFeed(userId: number, limit = 20, cursor?: string) {
    const cacheKey = `feed:${userId}:limit:${limit}`;

    if (!cursor) {
      const cachedFeed = await redis.get(cacheKey);

      if (cachedFeed) {
        console.log('CACHE HIT');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(cachedFeed);
      }

      console.log('CACHE MISS');
    }

    const conditions = [eq(follows.followerId, userId)];

    if (cursor) {
      const decoded = JSON.parse(
        Buffer.from(cursor, 'base64').toString('utf8'),
      ) as {
        createdAt: string;
        id: number;
      };

      const cursorDate = new Date(decoded.createdAt);

      conditions.push(
        or(
          lt(posts.createdAt, cursorDate),

          and(eq(posts.createdAt, cursorDate), lt(posts.id, decoded.id)),
        )!,
      );
    }

    const result = await db
      .select({
        id: posts.id,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .innerJoin(follows, eq(posts.userId, follows.followingId))
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit + 1);

    const hasMore = result.length > limit;

    const data = hasMore ? result.slice(0, limit) : result;

    const lastPost = data[data.length - 1];

    const nextCursor =
      hasMore && lastPost
        ? Buffer.from(
            JSON.stringify({
              createdAt: lastPost.createdAt.toISOString(),
              id: lastPost.id,
            }),
          ).toString('base64')
        : null;

    const response = {
      data,
      nextCursor,
      hasMore,
    };

    if (!cursor) {
      await redis.set(cacheKey, JSON.stringify(response), 'EX', 60);
    }

    return response;
  }
}
