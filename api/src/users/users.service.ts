import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { users } from '../db/schema';

@Injectable()
export class UsersService {
  async findAll() {
    return db.select().from(users);
  }

  async findOne(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));

    if (!result[0]) {
      throw new NotFoundException('User Not Found');
    }

    return result[0];
  }

  async create(user: { name: string; username: string }) {
    try {
      const result = await db
        .insert(users)
        .values({
          name: user.name,
          username: user.username,
        })
        .returning();

      return result[0];
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }

      throw error;
    }
  }
}
