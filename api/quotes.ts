import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, eq, quoteInquiriesTable, checkDatabaseRateLimit } from "@workspace/db";
import { CreateQuoteBody, CreateQuoteResponse } from "@workspace/api-zod";
import { sendQuoteEmails } from "./_lib/quote-email";

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string") {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function parseRequestBody(req: VercelRequest): any {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }
  return {};
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only accept POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 1. Database-backed rate limiting (per-IP window stored in Postgres)
  const clientIp = getClientIp(req);
  const rateLimit = await checkDatabaseRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: "Too many inquiries. Please try again later." });
  }

  const body = parseRequestBody(req);

  // 2. Honeypot check
  if (typeof body?.hp === "string" && body.hp.length > 0) {
    return res.status(201).json(CreateQuoteResponse.parse({ id: 0, createdAt: new Date() }));
  }

  // 3. Validation via Zod
  const parsed = CreateQuoteBody.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please check the inquiry details and try again." });
  }

  const input = parsed.data;
  const name = input.name.trim();
  const email = input.email?.trim() || null;
  const phone = input.phone?.trim() || null;

  if (!name || !/^[A-Z]{2}$/i.test(input.country) || (!email && !phone)) {
    return res.status(400).json({ error: "Please provide a name, valid country, and email or phone." });
  }

  // 4. Insert into database
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
        vehicles: input.vehicles.map((v) => v.trim()).filter(Boolean),
        otherVehicle: input.otherVehicle?.trim() || null,
        quantity: input.quantity ?? null,
        destination: input.destination?.trim() || null,
        message: input.message?.trim() || null,
        consent: input.consent,
        emailStatus: "pending",
      })
      .returning({ id: quoteInquiriesTable.id, createdAt: quoteInquiriesTable.createdAt });

    // 5. Send transaction emails
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
        vehicles: input.vehicles.map((v) => v.trim()).filter(Boolean),
        otherVehicle: input.otherVehicle?.trim() || null,
        quantity: input.quantity ?? null,
        destination: input.destination?.trim() || null,
        message: input.message?.trim() || null,
      });
      emailStatus = delivery.emailStatus;
    } catch (err) {
      console.error("Quote email delivery failed:", err);
    }

    // 6. Update email delivery status
    try {
      await db
        .update(quoteInquiriesTable)
        .set({ emailStatus })
        .where(eq(quoteInquiriesTable.id, inquiry.id));
    } catch (err) {
      console.error("Failed to update quote email status:", err);
    }

    return res.status(201).json(CreateQuoteResponse.parse(inquiry));
  } catch (error) {
    console.error("Failed to store quote inquiry:", error);
    return res.status(500).json({ error: "Unable to save your inquiry. Please try again." });
  }
}
