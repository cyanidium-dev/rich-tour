export interface OrderTableRow {
  id: string | number;
  index: number;
  orderNumber: string | number;
  tourTitle: string;
  daysQuantity: number;
  tourists: string;
  totalCost: number;
  commission?: number | null;
  mealType?: string | null;
  confirmationUrl?: string | null;
  costWithoutCommission: number;
  paidAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  statusId?: string;
  status: string;
  comment: string;
  agentId?: string;
  agentName?: string;
  agentCrmId?: string | number | null;
  details?: {
    index: number;
    pib: string;
    birthday: string;
    phone: string;
    passport: string;
    passportFinish: string;
    city: string;
    cost?: {
      tariff: number | null;
      accommodation: number | null;
      meals: number | null;
      airConditioning: number | null;
      room: string | null;
      insurance: string | null;
      insuranceAmount: number | null;
      frontSeats: string | null;
      frontSeatsAmount: number | null;
      touristTax: number | null;
      total: number | null;
      commission: number | null;
      withoutCommission: number | null;
    };
  }[];
}
