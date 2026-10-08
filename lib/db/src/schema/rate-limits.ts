import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const rateLimitsTable = pgTable("rate_limits", {
  key: varchar("key", { length: 128 }).primaryKey(),
  count: integer("count").notNull().default(1),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

export type RateLimit = typeof rateLimitsTable.$inferSelect;
