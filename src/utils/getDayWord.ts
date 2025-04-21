export function getDayWord(number: number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "днів";
  }

  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дні";

  return "днів";
}
