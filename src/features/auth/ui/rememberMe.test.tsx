// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axios from "axios";
import LoginForm from "./LoginForm";
import {
  REMEMBERED_CREDENTIALS_KEY,
  getRememberedCredentials,
  saveRememberedCredentials,
} from "@/lib/auth/rememberedCredentials";

vi.mock("axios", () => ({ default: { post: vi.fn(), isAxiosError: () => false } }));

const callbacks = () => ({ setIsError: vi.fn(), setIsNotificationShown: vi.fn() });
const fields = (container: HTMLElement) => ({
  email: container.querySelector('[name="email"]') as HTMLInputElement,
  password: container.querySelector('[name="password"]') as HTMLInputElement,
  remember: container.querySelector('input[type="checkbox"]') as HTMLInputElement,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

it("uses the correct credential field types and toggles password visibility without submitting", () => {
  const { container, getByRole, rerender } = render(<LoginForm {...callbacks()} />);
  const { email, password } = fields(container);
  expect(email.type).toBe("text");
  expect(email.autocomplete).toBe("username");
  expect(password.type).toBe("password");
  expect(password.autocomplete).toBe("current-password");
  fireEvent.change(email, { target: { value: "agency" } });
  fireEvent.change(password, { target: { value: "secret" } });
  const show = getByRole("button", { name: "Показати пароль" });
  expect(show.getAttribute("type")).toBe("button");
  expect(show.tabIndex).toBe(0);
  show.focus();
  expect(document.activeElement).toBe(show);
  fireEvent.click(show);
  expect(password.type).toBe("text");
  expect(getByRole("button", { name: "Приховати пароль" }).getAttribute("aria-pressed")).toBe(
    "true",
  );
  fireEvent.click(getByRole("button", { name: "Приховати пароль" }));
  expect(password.type).toBe("password");
  rerender(<LoginForm {...callbacks()} />);
  expect(email.value).toBe("agency");
  expect(password.value).toBe("secret");
  expect(axios.post).not.toHaveBeenCalled();
});

it("restores remembered credentials and removes them when unchecked", async () => {
  saveRememberedCredentials({ email: "agent@example.com", password: "saved password" });
  const { container } = render(<LoginForm {...callbacks()} />);
  await waitFor(() => expect(fields(container).email.value).toBe("agent@example.com"));
  expect(fields(container).password.value).toBe("saved password");
  expect(fields(container).remember.checked).toBe(true);
  fireEvent.click(fields(container).remember);
  expect(getRememberedCredentials()).toBeNull();
  expect(fields(container).remember.checked).toBe(false);
});

it("does not save credentials after a failed login", async () => {
  vi.mocked(axios.post).mockRejectedValue(new Error("LOGIN_FAILED"));
  const { container } = render(<LoginForm {...callbacks()} />);
  fireEvent.change(fields(container).email, { target: { value: "agency" } });
  fireEvent.change(fields(container).password, { target: { value: "secret" } });
  fireEvent.click(fields(container).remember);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() =>
    expect(axios.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "agency",
      password: "secret",
      rememberMe: true,
    }),
  );
  expect(window.localStorage.getItem(REMEMBERED_CREDENTIALS_KEY)).toBeNull();
});

it("saves credentials only after a successful remembered login", async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: { role: "agent" } });
  vi.spyOn(console, "error").mockImplementation(() => {});
  const { container } = render(<LoginForm {...callbacks()} />);
  fireEvent.change(fields(container).email, { target: { value: "agent@example.com" } });
  fireEvent.change(fields(container).password, { target: { value: "secret" } });
  fireEvent.click(fields(container).remember);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() =>
    expect(getRememberedCredentials()).toEqual({
      email: "agent@example.com",
      password: "secret",
    }),
  );
});

it("still accepts input when browser storage is blocked", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.mocked(axios.post).mockRejectedValue(new Error("LOGIN_FAILED"));
  const { container } = render(<LoginForm {...callbacks()} />);
  fireEvent.change(fields(container).email, { target: { value: "agency" } });
  fireEvent.change(fields(container).password, { target: { value: "secret" } });
  fireEvent.click(fields(container).remember);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(fields(container).email.value).toBe("agency");
});
