import type { TravelerInfo } from "@/features/booking";
export type { TravelerInfo } from "@/features/booking";

export interface BookingRequest {
  requestId: string;
  tourId: string;
  date: string;
  travelersQty: number;
  companyName?: string;
  email: string;
  phone: string;
  message?: string;
  travelers: TravelerInfo[];
}
