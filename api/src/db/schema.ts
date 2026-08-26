import {
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  name: varchar('name', {
    length: 100,
  }).notNull(),

  username: varchar('username', {
    length: 50,
  })
    .notNull()
    .unique(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),

  content: varchar('content', {
    length: 500,
  }).notNull(),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const follows = pgTable(
  'follows',
  {
    followerId: integer('follower_id')
      .notNull()
      .references(() => users.id),

    followingId: integer('following_id')
      .notNull()
      .references(() => users.id),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.followerId, table.followingId],
    }),
  ],
);
