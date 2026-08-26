import { Injectable } from '@nestjs/common';
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

    return result[0];
  }

  async create(user: { name: string; username: string }) {
    const result = await db
      .insert(users)
      .values({
        name: user.name,
        username: user.username,
      })
      .returning();

    return result[0];
  }
}
