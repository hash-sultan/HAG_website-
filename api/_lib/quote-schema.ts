import { z } from "zod";

export const CreateQuoteBody = z.object({
  locale: z.enum(["en", "zh"]),
  name: z.string().min(1).max(120),
  company: z.string().max(160).optional(),
  country: z.string().min(2).max(2),
  email: z.string().max(254).optional(),
  phone: z.string().max(40).optional(),
  inquiryType: z.enum(["vehicle-quote", "showroom-partner", "other"]),
  vehicles: z.array(z.string().max(120)).max(20),
  otherVehicle: z.string().max(300).optional(),
  quantity: z.enum(["1", "2-5", "6-20", "20+"]).optional(),
  destination: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
  consent: z.boolean(),
  hp: z.string().max(0).optional(),
});

export const CreateQuoteResponse = z.object({
  id: z.number(),
  createdAt: z.date(),
});

export type CreateQuoteBodyType = z.infer<typeof CreateQuoteBody>;
export type CreateQuoteResponseType = z.infer<typeof CreateQuoteResponse>;
