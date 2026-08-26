import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { db } from 'src/db/db';
import { follows, users } from 'src/db/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class FollowsService {
  async follow(dto: CreateFollowDto) {
    if (dto.followerId === dto.followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await db
      .select()
      .from(users)
      .where(eq(users.id, dto.followerId));

    if (!follower[0]) {
      throw new NotFoundException('Follower not found');
    }

    const following = await db
      .select()
      .from(users)
      .where(eq(users.id, dto.followingId));

    if (!following[0]) {
      throw new NotFoundException('User to follow not found');
    }

    const existing = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, dto.followerId),
          eq(follows.followingId, dto.followingId),
        ),
      );

    if (existing[0]) {
      throw new BadRequestException('Already following this user');
    }

    const result = await db.insert(follows).values(dto).returning();

    return result[0];
  }

  async getFollowing(userId: number) {
    return db.select().from(follows).where(eq(follows.followerId, userId));
  }
}
