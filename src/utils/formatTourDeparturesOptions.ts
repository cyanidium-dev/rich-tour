import { TourDepartures } from "@/types/tour";

export interface DateOption {
  key: string;
  label: string;
}

export function formatTourDeparturesToOptions(
  data: TourDepartures
): DateOption[] {
  return Object.entries(data).flatMap(([month, days]) => {
    const [year, monthStr] = month.split("-");
    return days.map(({ day }) => {
      const dd = String(day).padStart(2, "0");
      const mm = String(monthStr).padStart(2, "0");
      const yyyy = year;
      const date = `${dd}.${mm}.${yyyy}`;
      return {
        key: date,
        label: date,
      };
    });
  });
}
