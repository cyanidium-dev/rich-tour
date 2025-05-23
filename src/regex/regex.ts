export const footerPhoneRegex = /^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/;

export const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇґҐєЄ\s'"-]+$/;

export const latinNameRegex = /^[a-zA-Z\s'"-]+$/;

export const phoneRegex = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const emailRegex =
  /^([a-zA-Z0-9]+)([a-zA-Z0-9?'"`#$%&*+_./|^{}~]+)?@([a-zA-Z0-9_\-.]+)([.][a-zA-Z]{2,3})$/;

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
