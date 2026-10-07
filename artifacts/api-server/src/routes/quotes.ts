import { db, quoteInquiriesTable } from "@workspace/db";
import { CreateQuoteBody, CreateQuoteResponse } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { Router, type IRouter, type Request } from "express";
import { sendQuoteEmails } from "./quote-email";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function clientIp(req: Request): string {
  const forwarded = req.ip?.trim();
  if (forwarded) return forwarded;
  const socket = req.socket.remoteAddress?.trim();
  if (socket) return socket;
  return "unknown";
}

router.post("/quotes", async (req, res): Promise<void> => {
  const now = Date.now();
  const key = clientIp(req);
  const window = requestWindows.get(key);

  if (!window || now - window.startedAt >= RATE_LIMIT_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
  } else if (window.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.status(429).json({ error: "Too many inquiries. Please try again later." });
    return;
  } else {
    window.count += 1;
  }

  if (requestWindows.size > 10_000) {
    for (const [ip, entry] of requestWindows) {
      if (now - entry.startedAt >= RATE_LIMIT_WINDOW_MS) requestWindows.delete(ip);
    }
  }

  if (typeof req.body?.hp === "string" && req.body.hp.length > 0) {
    res.status(201).json(CreateQuoteResponse.parse({ id: 0, createdAt: new Date() }));
    return;
  }

  const parsed = CreateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check the inquiry details and try again." });
    return;
  }

  const input = parsed.data;
  const name = input.name.trim();
  const email = input.email?.trim() || null;
  const phone = input.phone?.trim() || null;

  if (!name || !/^[A-Z]{2}$/i.test(input.country) || (!email && !phone)) {
    res.status(400).json({ error: "Please provide a name, valid country, and email or phone." });
    return;
  }

  try {
    const [inquiry] = await db
      .insert(quoteInquiriesTable)
      .values({
        locale: input.locale,
        name,
        company: input.company?.trim() || null,
        country: input.country.toUpperCase(),
        email,
        phone,
        inquiryType: input.inquiryType,
        vehicles: input.vehicles.map((vehicle) => vehicle.trim()).filter(Boolean),
        otherVehicle: input.otherVehicle?.trim() || null,
        quantity: input.quantity ?? null,
        destination: input.destination?.trim() || null,
        message: input.message?.trim() || null,
        consent: input.consent,
        emailStatus: "pending",
      })
      .returning({ id: quoteInquiriesTable.id, createdAt: quoteInquiriesTable.createdAt });

    let emailStatus: "sent" | "partial" | "failed" = "failed";
    try {
      const delivery = await sendQuoteEmails({
        id: inquiry.id,
        locale: input.locale,
        name,
        company: input.company?.trim() || null,
        country: input.country.toUpperCase(),
        email,
        phone,
        inquiryType: input.inquiryType,
        vehicles: input.vehicles.map((vehicle) => vehicle.trim()).filter(Boolean),
        otherVehicle: input.otherVehicle?.trim() || null,
        quantity: input.quantity ?? null,
        destination: input.destination?.trim() || null,
        message: input.message?.trim() || null,
      });
      emailStatus = delivery.emailStatus;

      if (!delivery.configured) {
        req.log.error(
          { quoteId: inquiry.id, errorType: "resend_configuration_missing" },
          "Quote email delivery is not configured",
        );
      }
      for (const attempt of delivery.attempts) {
        if (!attempt.ok) {
          req.log.error(
            {
              quoteId: inquiry.id,
              emailType: attempt.kind,
              errorType: attempt.failure,
              statusCode: attempt.statusCode,
            },
            "Quote email delivery failed",
          );
        }
      }
    } catch (error) {
      req.log.error(
        {
          quoteId: inquiry.id,
          errorType: error instanceof Error ? error.name : "unknown",
        },
        "Quote email delivery failed",
      );
    }

    try {
      await db
        .update(quoteInquiriesTable)
        .set({ emailStatus })
        .where(eq(quoteInquiriesTable.id, inquiry.id));
    } catch (error) {
      req.log.error(
        {
          quoteId: inquiry.id,
          errorType: error instanceof Error ? error.name : "unknown",
        },
        "Failed to update quote email status",
      );
    }

    res.status(201).json(CreateQuoteResponse.parse(inquiry));
  } catch (error) {
    req.log.error(
      { errorType: error instanceof Error ? error.name : "unknown" },
      "Failed to store quote inquiry",
    );
    res.status(500).json({ error: "Unable to save your inquiry. Please try again." });
  }
});

export default router;