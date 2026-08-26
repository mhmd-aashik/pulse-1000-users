import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { db } from 'src/db/db';
import { desc, eq } from 'drizzle-orm';
import { follows, posts, users } from 'src/db/schema';
import { redis } from 'src/redis/redis';

@Injectable()
export class PostsService {
  async create(dto: CreatePostDto) {
    const user = await db.select().from(users).where(eq(users.id, dto.userId));

    if (!user[0]) {
      throw new NotFoundException('User not found');
    }

    const result = await db
      .insert(posts)
      .values({
        content: dto.content,
        userId: dto.userId,
      })
      .returning();

    const followers = await db
      .select({
        followerId: follows.followerId,
      })
      .from(follows)
      .where(eq(follows.followingId, dto.userId));

    const keys = followers.map(
      (follower) => `feed:${follower.followerId}:limit:20`,
    );

    if (keys.length > 0) {
      await redis.del(...keys);
    }

    return result[0];
  }

  async findAll() {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async findByUser(userId: number) {
    return db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }
}
