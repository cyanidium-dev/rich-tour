import { expect, it } from "vitest";
import { callBackValidation } from "./callBackFormValidation";

const schema = callBackValidation();

it("accepts a callback with the existing phone mask and optional message", () => {
  expect(
    schema.safeParse({
      name: "Іван",
      phone: "+38 (050) 123-45-67",
      message: "",
    }).success,
  ).toBe(true);
});

it("rejects empty, malformed and overlong values", () => {
  expect(schema.safeParse({ name: "", phone: "", message: "" }).success).toBe(false);
  expect(
    schema.safeParse({
      name: "Іван",
      phone: "+38 (150) 123-45-67",
      message: "",
    }).success,
  ).toBe(false);
  expect(
    schema.safeParse({
      name: "Іван",
      phone: "+38 (050) 123-45-67",
      message: "x".repeat(201),
    }).success,
  ).toBe(false);
});
