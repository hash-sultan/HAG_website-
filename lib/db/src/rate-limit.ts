import { db } from "./index";
import { rateLimitsTable } from "./schema/rate-limits";
import { eq, lt } from "drizzle-orm";

const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_REQUESTS = 5;

export async function checkDatabaseRateLimit(
  key: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS,
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const resetAt = new Date(Date.now() + windowMs);

  try {
    // Opportunistically clean up expired rows
    await db.delete(rateLimitsTable).where(lt(rateLimitsTable.resetAt, now));
  } catch {
    // Ignore cleanup errors
  }

  try {
    const [existing] = await db
      .select()
      .from(rateLimitsTable)
      .where(eq(rateLimitsTable.key, key));

    if (!existing) {
      await db.insert(rateLimitsTable).values({
        key,
        count: 1,
        resetAt,
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (existing.resetAt <= now) {
      await db
        .update(rateLimitsTable)
        .set({ count: 1, resetAt })
        .where(eq(rateLimitsTable.key, key));
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    const nextCount = existing.count + 1;
    await db
      .update(rateLimitsTable)
      .set({ count: nextCount })
      .where(eq(rateLimitsTable.key, key));

    return { allowed: true, remaining: Math.max(0, maxRequests - nextCount) };
  } catch (error) {
    console.error("Database rate limit error:", error);
    // Fail open on transient error
    return { allowed: true, remaining: 1 };
  }
}
