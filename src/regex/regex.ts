export const footerPhoneRegex = /^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/;

export const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇґҐєЄ\s'"-]+$/;

export const latinNameRegex = /^[a-zA-Z\s'"-]+$/;

export const phoneRegex = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const emailRegex =
  /^([a-zA-Z0-9]+)([a-zA-Z0-9?'"`#$%&*+_./|^{}~]+)?@([a-zA-Z0-9_\-.]+)([.][a-zA-Z]{2,3})$/;

export const edrpouRegex = /^\d{8,10}$/;

export const edrpouMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d?/, /\d?/];

export const dateFormatRegex =
    /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;

export const isValidBirthDate = (value?: string): boolean => {
  if (!value || !dateFormatRegex.test(value)) return false;

  const [day, month, year] = value.split(".").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  if (birthDate > today) return false;

  let age = today.getFullYear() - year;
  const hasBirthdayPassed =
      today >= new Date(today.getFullYear(), month - 1, day);

  if (!hasBirthdayPassed) age--;

  return age >= 0 && age <= 120;
};

export const isValidPassportExpirationDate = (
    value?: string,
    minMonths = 6
): boolean => {
  if (!value || !dateFormatRegex.test(value)) return false;

  const [day, month, year] = value.split(".").map(Number);
  const expirationDate = new Date(year, month - 1, day);

  const minValidDate = new Date();
  minValidDate.setMonth(minValidDate.getMonth() + minMonths);

  return expirationDate >= minValidDate;
};

export const phoneMask = [
  "+",
  "3",
  "8",
  " ",
  "(",
  /[0-9]/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

export const dateMask = [
  /[0-3]/,
  /[0-9]/,
  ".",
  /[0-1]/,
  /[0-9]/,
  ".",
  /[1-9]/,
  /\d/,
  /\d/,
  /\d/,
];
