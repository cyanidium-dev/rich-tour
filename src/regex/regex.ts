export const footerPhoneRegex = /^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/;

export const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇґҐєЄ\s'"-]+$/;

export const phoneRegex = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

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
