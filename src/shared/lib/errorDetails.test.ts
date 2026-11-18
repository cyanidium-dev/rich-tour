import { expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { formatErrorDetails } from "./errorDetails";

it("preserves network failures without serializing the request or credentials", () => {
  const error = new AxiosError("Network Error", "ERR_NETWORK", {
    url: "/api/booking?token=private-query",
    headers: new AxiosHeaders({ Authorization: "Bearer private-auth" }),
    data: '{"passport":"AB123456"}',
  });
  const text = formatErrorDetails(error);
  expect(text).toContain("Network Error");
  expect(text).toContain("ERR_NETWORK");
  expect(text).toContain("/api/booking");
  expect(text).not.toContain("private-query");
  expect(text).not.toContain("private-auth");
  expect(text).not.toContain("AB123456");
});

it("redacts structured and free-text personal data, secrets and nested causes", () => {
  const text = formatErrorDetails(
    new Error("Invalid passport AB123456", {
      cause: {
        endpoint: "contact/set/",
        response: {
          errors: [{ field: "passport", message: "Bad AB123456 for Anna" }],
          passport: "AB123456",
          identificationCode: "0123456781",
          token: "private-token",
          raw: 'Invalid input: "password":"private-password", token=private-token',
          email: "test@example.com",
        },
      },
    }),
    ["AB123456", "Anna"],
  );
  expect(text).toContain("Invalid passport");
  expect(text).toContain('"field": "passport"');
  expect(text).toContain("contact/set/");
  for (const value of [
    "AB123456",
    "Anna",
    "0123456781",
    "private-token",
    "private-password",
    "test@example.com",
  ]) {
    expect(text).not.toContain(value);
  }
});

it("handles unexpected strings, circular responses and excessively long errors", () => {
  expect(formatErrorDetails("Unexpected gateway response")).toContain(
    "Unexpected gateway response",
  );
  expect(formatErrorDetails(new TypeError("crypto.randomUUID is not a function"))).toContain(
    "crypto.randomUUID is not a function",
  );
  const circular: Record<string, unknown> = { error: "Invalid response" };
  circular.self = circular;
  expect(formatErrorDetails(circular)).toContain("Invalid response");
  expect(formatErrorDetails("x".repeat(30000))).toContain("[довгу відповідь скорочено]");
});
