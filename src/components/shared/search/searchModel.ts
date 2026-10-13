import { z } from "zod";

export const months = [
  { label: "Січень", key: "01" },
  { label: "Лютий", key: "02" },
  { label: "Березень", key: "03" },
  { label: "Квітень", key: "04" },
  { label: "Травень", key: "05" },
  { label: "Червень", key: "06" },
  { label: "Липень", key: "07" },
  { label: "Серпень", key: "08" },
  { label: "Вересень", key: "09" },
  { label: "Жовтень", key: "10" },
  { label: "Листопад", key: "11" },
  { label: "Грудень", key: "12" },
] as const;

export const searchSchema = z.object({
  country: z.string().min(1).nullable(),
  month: z.union([z.literal(null), z.string().regex(/^(0[1-9]|1[0-2])$/)]),
});

export type SearchValues = z.infer<typeof searchSchema>;

export function searchHref(values: SearchValues): string {
  const parsed = searchSchema.safeParse(values);
  if (!parsed.success) return "/search";
  const params = new URLSearchParams();
  if (parsed.data.country) params.set("country", parsed.data.country);
  if (parsed.data.month) params.set("month", parsed.data.month);
  return params.size ? `/search?${params.toString()}` : "/search";
}
