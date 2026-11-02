type CalendarStatus = {
  label: string;
  image: string;
  borderColor?: string;
  backgroundColor?: string;
};

export const calendarStatuses: Record<string, CalendarStatus> = {
  guaranteed: {
    label: "Гарантований виїзд",
    image: "/images/icons/calendar/guaranteed.svg",
  },
  available: {
    label: "Місця є",
    image: "/images/icons/calendar/available.svg",
    borderColor: "#73A91C",
    backgroundColor: "#EAF2DD",
  },
  hot: { label: "Гарячий тур", image: "/images/icons/calendar/hot.svg" },
  fewSeats: {
    label: "Мало місць",
    image: "/images/icons/calendar/fewSeats.svg",
    borderColor: "#FFB429",
    backgroundColor: "#FFF4DF",
  },
  discount: {
    label: "Діє знижка раннього бронювання",
    image: "/images/icons/calendar/discount.svg",
  },
  noSeats: {
    label: "Місць немає",
    image: "/images/icons/calendar/noSeats.svg",
    borderColor: "#E43A3A",
    backgroundColor: "#FBE2E2",
  },
  specialPrice: {
    label: "Спеціальна ціна - special price",
    image: "/images/icons/calendar/specialPrice.svg",
  },
  tourInRecruitment: {
    label: "Тур в наборі",
    image: "/images/icons/calendar/tourInRecruitment.svg",
  },
  onRequest: {
    label: "Виїзд під запит",
    image: "/images/icons/calendar/onRequest.svg",
    borderColor: "#4C6FFF",
    backgroundColor: "#E4E9FF",
  },
  noDeparture: {
    label: "Немає виїзду",
    image: "/images/icons/calendar/noDeparture.svg",
    borderColor: "transparent",
  },
};
