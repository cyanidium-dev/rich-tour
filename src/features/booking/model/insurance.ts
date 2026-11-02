import type { RefinementCtx } from "zod";
import { isValidBirthDate } from "@/regex/regex";

export const insuranceCodeNotice =
  "для оформлення страхового полісу просимо вказати ідентифікаційний код як мінімум одного із повнолітніх туристів";
export const insuranceCodeRequired =
  "Вкажіть ідентифікаційний код хоча б одного повнолітнього туриста зі страховкою";
export const insuranceCodeFormatError = "Ідентифікаційний код має містити рівно 10 цифр";
export const insuranceCodeChecksumError =
  "Перевірте ідентифікаційний код: контрольна цифра не збігається";

type InsuranceTraveler = {
  birthDate: string;
  insurance?: unknown;
  identificationCode?: string;
};

export function needsInsuranceCode(traveler: InsuranceTraveler): boolean {
  if (!traveler.insurance || !isValidBirthDate(traveler.birthDate)) return false;
  const [day, month, year] = traveler.birthDate.split(".").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day))
    age--;
  return age >= 18;
}

export function isValidIdentificationCode(code: string): boolean {
  if (!/^[0-9]{10}$/.test(code)) return false;
  const weights = [-1, 5, 7, 9, 4, 6, 10, 5, 7];
  const total = weights.reduce((sum, weight, index) => sum + weight * Number(code[index]), 0);
  const checksum = (((total % 11) + 11) % 11) % 10;
  return checksum === Number(code[9]);
}

export function validateInsuranceTravelers(travelers: InsuranceTraveler[], ctx: RefinementCtx) {
  const adults = travelers.filter(needsInsuranceCode);
  travelers.forEach((traveler, index) => {
    if (!needsInsuranceCode(traveler) || !traveler.identificationCode) return;
    const code = traveler.identificationCode;
    if (!isValidIdentificationCode(code))
      ctx.addIssue({
        code: "custom",
        path: [index, "identificationCode"],
        message: /^[0-9]{10}$/.test(code) ? insuranceCodeChecksumError : insuranceCodeFormatError,
      });
  });
  if (
    adults.length &&
    !adults.some((traveler) => isValidIdentificationCode(traveler.identificationCode ?? ""))
  )
    ctx.addIssue({ code: "custom", path: ["root"], message: insuranceCodeRequired });
}
