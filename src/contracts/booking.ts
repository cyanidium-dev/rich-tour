export interface TravelerInfo {
  name: string;
  surname: string;
  phone?: string;
  passport: string;
  birthDate: string;
  passportExpiration: string;
  boardingCity: string;
  insurance: boolean;
  frontSeats: boolean;
  passportInProgress: boolean;
}

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
