export function formatDate(isoDate: string): string {
  const year = isoDate?.slice(2, 4);
  const month = isoDate?.slice(5, 7);
  const day = isoDate?.slice(8, 10);
  // const date = new Date(isoDate);
  // const day = String(date.getUTCDate()).padStart(2, "0");
  // const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  // const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
}
