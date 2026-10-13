export interface OrderTableRow {
  id: string | number;
  index: number;
  orderNumber: string | number;
  tourTitle: string;
  daysQuantity: number;
  tourists: string;
  totalCost: number;
  commission: number;
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
  }[];
}
