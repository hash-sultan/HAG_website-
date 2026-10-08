import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  try {
    // Ping Supabase PostgreSQL via transaction pooler to verify health and prevent project auto-pause
    await db.execute(sql`SELECT 1`);
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check error:", error);
    return res.status(500).json({ status: "error", error: "Database unreachable" });
  }
}
