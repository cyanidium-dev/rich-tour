import { z } from "zod";

export const ordersFiltersSchema = z.object({
  search: z.string(),
  agentId: z.string().nullable(),
  status: z.string().nullable(),
  hasDebt: z.union([z.literal("так"), z.literal("ні"), z.literal(null)]),
  period: z.object({
    from: z.date().nullable(),
    to: z.date().nullable(),
  }),
});

export type OrdersFiltersState = z.infer<typeof ordersFiltersSchema>;
