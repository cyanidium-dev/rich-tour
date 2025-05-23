type TourDepartures = {
  [key: string]: { day: number; price?: number; status: string[] }[];
};

export const tourDepartures: TourDepartures = {
  "2025-04": [
    { day: 1, price: 318, status: ["guaranteed", "fewSeats"] },
    { day: 5, price: 299, status: ["discount"] },
    { day: 9, price: 310, status: ["available"] },
    { day: 12, price: 318, status: ["guaranteed", "hot", "available"] },
    { day: 15, price: 305, status: ["onRequest"] },
    { day: 18, status: ["noDeparture"] },
    { day: 20, price: 295, status: ["guaranteed"] },
    { day: 22, status: ["noDeparture"] },
    { day: 25, price: 312, status: ["available"] },
    { day: 28, price: 320, status: ["noSeats"] },
    { day: 30, price: 299, status: ["discount", "hot", "fewSeats"] },
  ],
  "2025-05": [
    { day: 2, price: 299, status: ["available"] },
    { day: 6, price: 285, status: ["guaranteed", "hot"] },
    { day: 9, status: ["noDeparture"] },
    { day: 10, price: 298, status: ["fewSeats"] },
    { day: 14, price: 310, status: ["guaranteed"] },
    { day: 17, status: ["noDeparture"] },
    { day: 20, price: 295, status: ["discount"] },
    { day: 23, price: 305, status: ["onRequest"] },
    { day: 25, price: 308, status: ["guaranteed", "available"] },
    { day: 29, status: ["noSeats"] },
  ],
  "2025-06": [
    { day: 1, price: 288, status: ["available"] },
    { day: 4, price: 299, status: ["hot"] },
    { day: 7, status: ["noDeparture"] },
    { day: 10, price: 310, status: ["guaranteed"] },
    { day: 12, price: 298, status: ["discount", "fewSeats"] },
    { day: 15, price: 290, status: ["available"] },
    { day: 18, status: ["noDeparture"] },
    { day: 21, price: 300, status: ["guaranteed", "hot"] },
    { day: 25, status: ["noSeats"] },
    { day: 28, price: 285, status: ["onRequest"] },
    { day: 31, price: 299, status: ["discount"] },
  ],
};
