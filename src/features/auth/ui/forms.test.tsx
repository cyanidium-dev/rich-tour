// @vitest-environment jsdom
import React from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import axios from "axios";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("axios", () => ({ default: { post: vi.fn(), patch: vi.fn(), isAxiosError: () => false } }));
import {
  LoginForm,
  SignUpForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ChangePassword,
} from "@/features/auth";
import { AgentInfoForm, AgencyInfoForm } from "@/features/profile-edit";
const callbacks = () => ({ setIsError: vi.fn(), setIsNotificationShown: vi.fn() });
const agentValues = {
  email: "agent@example.com",
  companyName: "Company",
  legalCompanyName: "Legal",
  phone: "+38 (067) 123-45-67",
  edrpou: "12345678",
  city: "Kyiv",
  taxForm: "fop",
  site: "",
};
const agencyValues = {
  legalAgencyName: "Agency",
  login: "agency",
  agencyEmail: "agency@example.com",
  agencyPhone: agentValues.phone,
  mainOfficeEmail: "office@example.com",
};
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
function fill(container: HTMLElement, name: string, value: string) {
  fireEvent.change(container.querySelector(`[name="${name}"]`)!, { target: { value } });
}
function submit(container: HTMLElement) {
  fireEvent.submit(container.querySelector("form")!);
}
it("shows the original required message when an empty field loses focus", async () => {
  const { container } = render(<ForgotPasswordForm {...callbacks()} />);
  fireEvent.blur(container.querySelector('[name="email"]')!);
  await waitFor(() =>
    expect(container.querySelector("p.text-red")?.textContent).toBe(
      "Дане поле обов'язкове до заповнення",
    ),
  );
});
it("reinitializes an agent profile when server props change", async () => {
  const props = callbacks();
  const { container, rerender } = render(<AgentInfoForm initialValues={agentValues} {...props} />);
  fill(container, "companyName", "Unsaved change");
  rerender(
    <AgentInfoForm initialValues={{ ...agentValues, companyName: "Server change" }} {...props} />,
  );
  await waitFor(() =>
    expect((container.querySelector('[name="companyName"]') as HTMLInputElement).value).toBe(
      "Server change",
    ),
  );
});
it("smoke: all seven forms reject empty submissions without API calls", async () => {
  for (const Component of [
    LoginForm,
    SignUpForm,
    ForgotPasswordForm,
    ResetPasswordForm,
    ChangePassword,
  ]) {
    const { container } = render(<Component {...callbacks()} />);
    submit(container);
    await waitFor(() => expect(container.querySelectorAll("p.text-red").length).toBeGreaterThan(0));
    cleanup();
  }
  for (const element of [
    <AgentInfoForm key="agent" initialValues={{ ...agentValues, email: "" }} {...callbacks()} />,
    <AgencyInfoForm key="agency" initialValues={{ ...agencyValues, login: "" }} {...callbacks()} />,
  ]) {
    const { container } = render(element);
    submit(container);
    await waitFor(() => expect(container.querySelectorAll("p.text-red").length).toBeGreaterThan(0));
    cleanup();
  }
  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.patch).not.toHaveBeenCalled();
});
it("smoke: password recovery remains a local reset and notification", async () => {
  const props = callbacks();
  const { container } = render(<ForgotPasswordForm {...props} />);
  fill(container, "email", "test@example.com");
  submit(container);
  await waitFor(() => expect(props.setIsNotificationShown).toHaveBeenCalledWith(true));
  expect((container.querySelector("input") as HTMLInputElement).value).toBe("");
  expect(axios.post).not.toHaveBeenCalled();
});
it("smoke: matching passwords retain the change-password payload", async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });
  const props = callbacks();
  const { container } = render(<ChangePassword {...props} />);
  fill(container, "password", "new password");
  fill(container, "repeatPassword", "new password");
  submit(container);
  await waitFor(() => expect(props.setIsNotificationShown).toHaveBeenCalledWith(true));
  expect(axios.post).toHaveBeenCalledWith(
    "/api/auth/change-password",
    { password: "new password" },
    expect.objectContaining({ withCredentials: true }),
  );
});
it("smoke: both profiles submit existing payloads", async () => {
  vi.mocked(axios.patch).mockResolvedValue({ data: { success: true } });
  for (const [element, url] of [
    [
      <AgentInfoForm key="agent" initialValues={agentValues} {...callbacks()} />,
      "/api/agent/profile",
    ],
    [
      <AgencyInfoForm key="agency" initialValues={agencyValues} {...callbacks()} />,
      "/api/agency/profile",
    ],
  ] as const) {
    const { container } = render(element);
    submit(container);
    await waitFor(() =>
      expect(axios.patch).toHaveBeenCalledWith(
        url,
        expect.objectContaining(
          url.includes("/agent/") ? { email: agentValues.email } : { login: agencyValues.login },
        ),
        expect.objectContaining({ withCredentials: true }),
      ),
    );
    cleanup();
  }
});

it("retains profile edits on failure, releases loading and allows a retry", async () => {
  for (const kind of ["agent", "agency"] as const) {
    const props = callbacks();
    const field = kind === "agent" ? "companyName" : "legalAgencyName";
    let rejectRequest!: (error: Error) => void;
    vi.mocked(axios.patch).mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectRequest = reject;
        }),
    );
    const { container, rerender } = render(
      kind === "agent" ? (
        <AgentInfoForm initialValues={agentValues} {...props} />
      ) : (
        <AgencyInfoForm initialValues={agencyValues} {...props} />
      ),
    );
    fill(container, field, "Edited name");
    submit(container);
    const button = container.querySelector(
      'form > div button:not([type="button"])',
    ) as HTMLButtonElement;
    await waitFor(() => expect(button.disabled).toBe(true));
    await act(async () => {
      rejectRequest(new Error("fixture failure"));
    });
    expect(props.setIsError).toHaveBeenLastCalledWith(true);
    expect(props.setIsNotificationShown).toHaveBeenLastCalledWith(true);
    expect((container.querySelector(`[name="${field}"]`) as HTMLInputElement).value).toBe(
      "Edited name",
    );
    expect(button.disabled).toBe(false);
    vi.mocked(axios.patch).mockResolvedValueOnce({ data: { success: true } });
    submit(container);
    await waitFor(() => expect(button.disabled).toBe(false));
    await waitFor(() => expect(props.setIsError).toHaveBeenLastCalledWith(false));
    // A parent rerender with unchanged server data must not undo the saved edits.
    rerender(
      kind === "agent" ? (
        <AgentInfoForm initialValues={{ ...agentValues }} {...props} />
      ) : (
        <AgencyInfoForm initialValues={{ ...agencyValues }} {...props} />
      ),
    );
    expect((container.querySelector(`[name="${field}"]`) as HTMLInputElement).value).toBe(
      "Edited name",
    );
    cleanup();
  }
});

it("smoke: login API failures preserve notification and backend error text", async () => {
  vi.mocked(axios.post).mockRejectedValue(new Error("LOGIN_FAILED"));
  const props = { ...callbacks(), setErrorMessage: vi.fn() };
  const { container } = render(<LoginForm {...props} />);
  fill(container, "email", "agency");
  fill(container, "password", "test");
  submit(container);
  await waitFor(() => expect(props.setIsError).toHaveBeenCalledWith(true));
  expect(props.setErrorMessage).toHaveBeenCalledWith("LOGIN_FAILED");
  expect(props.setIsNotificationShown).toHaveBeenCalledWith(true);
});
it("smoke: registration retains request fields and success reset", async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: { success: true } });
  const props = callbacks();
  const { container } = render(<SignUpForm {...props} />);
  for (const [name, value] of Object.entries({ ...agentValues, password: "123456" })) {
    if (name !== "taxForm" && name !== "phone" && name !== "edrpou") fill(container, name, value);
  }
  fireEvent.input(container.querySelector('[name="phone"]')!, {
    target: { value: agentValues.phone },
  });
  fireEvent.input(container.querySelector('[name="edrpou"]')!, {
    target: { value: agentValues.edrpou },
  });
  submit(container);
  await waitFor(() => expect(props.setIsNotificationShown).toHaveBeenCalledWith(true));
  expect(axios.post).toHaveBeenCalledWith(
    "/api/auth/sign-up",
    expect.objectContaining({ ...agentValues, password: "123456" }),
    expect.anything(),
  );
  expect((container.querySelector('[name="email"]') as HTMLInputElement).value).toBe("");
});
it("smoke: reset-password stub never contacts the API", async () => {
  const props = callbacks();
  const { container } = render(<ResetPasswordForm {...props} />);
  fill(container, "password", "test");
  fill(container, "repeatPassword", "test");
  submit(container);
  await waitFor(() => expect(props.setIsNotificationShown).toHaveBeenCalledWith(true));
  expect(axios.post).not.toHaveBeenCalled();
});
