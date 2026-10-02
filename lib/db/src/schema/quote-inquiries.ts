import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

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
  quantity: varchar("quantity", { length: 16 }),
  destination: varchar("destination", { length: 200 }),
  message: varchar("message", { length: 2000 }),
  consent: boolean("consent").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuoteInquirySchema = createInsertSchema(quoteInquiriesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertQuoteInquiry = z.infer<typeof insertQuoteInquirySchema>;
export type QuoteInquiry = typeof quoteInquiriesTable.$inferSelect;