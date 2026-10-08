export type QuoteEmailDetails = {
  id: number;
  locale: "en" | "zh";
  name: string;
  company: string | null;
  country: string;
  email: string | null;
  phone: string | null;
  inquiryType: string;
  vehicles: string[];
  otherVehicle?: string | null;
  quantity: string | null;
  destination: string | null;
  message: string | null;
};

export type QuoteEmailStatus = "sent" | "partial" | "failed";
type EmailKind = "business_notification" | "visitor_acknowledgement";

type EmailAttempt = {
  kind: EmailKind;
  ok: boolean;
  statusCode?: number;
  failure?: "network_error" | "http_error";
};

type MailEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

type Fetcher = typeof fetch;

function formatQuote(details: QuoteEmailDetails): string {
  return [
    `Reference: ${details.id}`,
    `Name: ${details.name}`,
    `Company: ${details.company || "—"}`,
    `Country / region: ${details.country}`,
    `Email: ${details.email || "—"}`,
    `Phone: ${details.phone || "—"}`,
    `Inquiry type: ${details.inquiryType}`,
    `Vehicles: ${details.vehicles.join(", ") || "—"}`,
    `Other vehicle: ${details.otherVehicle || "—"}`,
    `Quantity: ${details.quantity || "—"}`,
    `Destination: ${details.destination || "—"}`,
    `Message: ${details.message || "—"}`,
  ].join("\n");
}

export async function sendQuoteEmails(
  details: QuoteEmailDetails,
  environment: MailEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  },
  fetcher: Fetcher = fetch,
): Promise<{ emailStatus: QuoteEmailStatus; attempts: EmailAttempt[]; configured: boolean }> {
  const apiKey = environment.RESEND_API_KEY;
  const from = environment.CONTACT_FROM_EMAIL;
  const to = environment.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return { emailStatus: "failed", attempts: [], configured: false };
  }

  const messages: Array<{
    kind: EmailKind;
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
  }> = [{
    kind: "business_notification",
    to,
    subject: `New vehicle inquiry #${details.id}`,
    text: formatQuote(details),
    ...(details.email ? { replyTo: details.email } : {}),
  }];

  if (details.email) {
    const acknowledgement = details.locale === "en"
      ? `Hello ${details.name},\n\nWe received your inquiry and saved it for review. Our team will follow up using the contact details you provided.\n\nReference: ${details.id}\n\nHuivex Auto Global`
      : `您好，${details.name}：\n\n我们已收到并保存您的询价，团队将通过您提供的联系方式跟进。\n\n参考编号：${details.id}\n\nHuivex Auto Global`;
    messages.push({
      kind: "visitor_acknowledgement",
      to: details.email,
      subject: details.locale === "en" ? "We received your inquiry" : "我们已收到您的询价",
      text: acknowledgement,
    });
  }

  const attempts = await Promise.all(messages.map(async (message): Promise<EmailAttempt> => {
    try {
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          ...(message.replyTo ? { reply_to: message.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      return {
        kind: message.kind,
        ok: response.ok,
        statusCode: response.status,
        ...(!response.ok ? { failure: "http_error" as const } : {}),
      };
    } catch {
      return { kind: message.kind, ok: false, failure: "network_error" };
    }
  }));

  const successes = attempts.filter((attempt) => attempt.ok).length;
  const emailStatus: QuoteEmailStatus = successes === attempts.length
    ? "sent"
    : successes > 0
      ? "partial"
      : "failed";

  return { emailStatus, attempts, configured: true };
}
