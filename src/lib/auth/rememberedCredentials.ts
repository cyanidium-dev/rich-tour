export const REMEMBERED_CREDENTIALS_KEY = "rich-tour.remembered-credentials.v1";

export type RememberedCredentials = {
  email: string;
  password: string;
};

export function clearRememberedCredentials() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REMEMBERED_CREDENTIALS_KEY);
  } catch {
    // Storage may be unavailable (for example, in a restricted browser context).
  }
}

export function getRememberedCredentials(): RememberedCredentials | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(REMEMBERED_CREDENTIALS_KEY);
    if (!value) return null;
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "email" in parsed &&
      typeof parsed.email === "string" &&
      "password" in parsed &&
      typeof parsed.password === "string"
    ) {
      return { email: parsed.email, password: parsed.password };
    }
    clearRememberedCredentials();
  } catch {
    clearRememberedCredentials();
  }
  return null;
}

export function saveRememberedCredentials(credentials: RememberedCredentials) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REMEMBERED_CREDENTIALS_KEY, JSON.stringify(credentials));
  } catch {
    // A blocked or full store must not prevent a successful login.
  }
}
