import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const checkHealth = async (_req: any, res: any) => {
  try {
    await db.execute(sql`SELECT 1`);
    const data = HealthCheckResponse.parse({ status: "ok" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", error: "Database unreachable" });
  }
};

router.get("/health", checkHealth);
router.get("/healthz", checkHealth);

export default router;
