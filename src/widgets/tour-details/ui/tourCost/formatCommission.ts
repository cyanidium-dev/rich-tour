type AgencyCommission = { type: string; value: number };

export function formatCommission(
  commission: AgencyCommission,
  currency: "EUR" | "USD",
  convert: (amount: number) => number,
): string {
  if (commission.type === "percent") return `${commission.value}%`;
  return `${convert(commission.value)} ${currency === "EUR" ? "€" : "$"}`;
}
