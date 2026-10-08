import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { sql, eq, lt } from "drizzle-orm";
// @ts-ignore
import pg from "pg";

const { Pool } = pg;

export const quoteInquiriesTable = pgTable("quote_inquiries", {
  id: serial("id").primaryKey(),
  locale: varchar("locale", { length: 8 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  company: varchar("company", { length: 160 }),
  country: varchar("country", { length: 2 }).notNull(),
  email: varchar("email", { length: 254 }),
  phone: varchar("phone", { length: 40 }),
  inquiryType: varchar("inquiry_type", { length: 32 }).notNull(),
  vehicles: text("vehicles").array().notNull().default([]),
  otherVehicle: varchar("other_vehicle", { length: 300 }),
  quantity: varchar("quantity", { length: 16 }),
  destination: varchar("destination", { length: 200 }),
  message: varchar("message", { length: 2000 }),
  consent: boolean("consent").notNull().default(false),
  emailStatus: varchar("email_status", { length: 16 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rateLimitsTable = pgTable("rate_limits", {
  key: varchar("key", { length: 255 }).primaryKey(),
  count: integer("count").notNull().default(1),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

let poolInstance: pg.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set in environment variables");
    }
    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    dbInstance = drizzle(poolInstance);
  }
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const instance = getDb() as any;
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_REQUESTS = 5;

export async function checkDatabaseRateLimit(
  key: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS,
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const database = getDb();
    const now = new Date();
    const resetAt = new Date(Date.now() + windowMs);

    try {
      await database.delete(rateLimitsTable).where(lt(rateLimitsTable.resetAt, now));
    } catch {
      // Ignore opportunistic cleanup errors
    }

    const [existing] = await database
      .select()
      .from(rateLimitsTable)
      .where(eq(rateLimitsTable.key, key));

    if (!existing) {
      await database.insert(rateLimitsTable).values({
        key,
        count: 1,
        resetAt,
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (existing.resetAt <= now) {
      await database
        .update(rateLimitsTable)
        .set({ count: 1, resetAt })
        .where(eq(rateLimitsTable.key, key));
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    const nextCount = existing.count + 1;
    await database
      .update(rateLimitsTable)
      .set({ count: nextCount })
      .where(eq(rateLimitsTable.key, key));

    return { allowed: true, remaining: Math.max(0, maxRequests - nextCount) };
  } catch (error) {
    console.error("Database rate limit error:", error);
    return { allowed: true, remaining: 1 };
  }
}

export { sql, eq };
