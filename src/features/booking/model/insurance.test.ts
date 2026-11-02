import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { isValidIdentificationCode, needsInsuranceCode } from "./insurance";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 1, 12));
});
afterEach(() => vi.useRealTimers());

it.each([
  ["02.11.2008", false],
  ["01.11.2008", true],
  ["31.10.2008", true],
  ["01.01.2000", true],
  ["29.02.2000", true],
  ["31.02.2000", false],
  ["29.02.2001", false],
  ["31.04.2000", false],
  ["01.01.2099", false],
  ["", false],
  ["01.01.20", false],
])("requires a code for birth date %s: %s", (birthDate, expected) => {
  expect(needsInsuranceCode({ insurance: true, birthDate })).toBe(expected);
  expect(needsInsuranceCode({ insurance: false, birthDate })).toBe(false);
});

it.each([
  ["1759013776", true],
  ["2530414071", true],
  ["0123456781", true],
  ["0000000030", true], // Sum 21: remainder 10 maps to zero.
  ["9000000002", true], // Sum -9: mathematical modulo 11 is 2.
  ["1759013770", false],
  ["012345678", false],
  ["01234567810", false],
  ["012345678a", false],
  [" 0123456781", false],
  ["", false],
])("validates the checksum and format of %s: %s", (code, expected) => {
  expect(isValidIdentificationCode(code)).toBe(expected);
});
