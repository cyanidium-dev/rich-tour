import { isAxiosError } from "axios";

const hidden = "[приховано]";
const sensitiveKey =
  /password|restapipassword|token|authorization|cookie|secret|api.?key|passport|pasport|identification|identifik|phone|telefon|email|birth|bdate|datanaro|^(name|surname|namelast|login|client|travelers|payload|config|request|headers)$/i;

/** Only error diagnostics are serialized; request configs and credentials never are. */
export function formatErrorDetails(error: unknown, sensitiveValues: string[] = []): string {
  const secrets = [...sensitiveValues];
  const seen = new WeakSet<object>();

  function cleanText(value: string) {
    let text = value;
    for (const secret of secrets) {
      if (secret.length < 3) continue;
      for (const variant of new Set([secret, secret.toUpperCase(), secret.toLowerCase()])) {
        text = text.split(variant).join(hidden);
      }
    }
    return text
      .replace(/\bBearer\s+[^\s"'<>]+/gi, `Bearer ${hidden}`)
      .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+\b/g, hidden)
      .replace(
        /\b(token|password|restapipassword|authorization|cookie|secret|api[_-]?key)["']?\s*[=:]\s*("[^"]*"|'[^']*'|[^\s,;<>]+)/gi,
        `$1=${hidden}`,
      )
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, hidden);
  }

  function serialize(value: unknown, depth: number): unknown {
    if (depth > 8) return "[вкладені дані скорочено]";
    if (typeof value === "string") return cleanText(value);
    if (value === null || value === undefined || typeof value === "boolean") return value;
    if (typeof value === "number" || typeof value === "bigint") {
      const cleaned = cleanText(String(value));
      return cleaned === String(value) && typeof value === "number" ? value : cleaned;
    }
    if (typeof value !== "object") return cleanText(String(value));
    if (seen.has(value)) return "[повторне посилання]";
    seen.add(value);

    if (isAxiosError(value)) {
      // Axios config contains the CRM token and the complete booking payload.
      const headers = value.config?.headers;
      for (const key of ["token", "Authorization", "authorization"]) {
        const secret = headers?.[key];
        if (typeof secret === "string") secrets.push(secret);
      }
      const endpoint = value.config?.url?.split(/[?#]/)[0];
      return serialize(
        {
          type: value.name,
          message: value.message,
          code: value.code,
          endpoint: endpoint?.replace(/^(https?:\/\/)[^/@]+:[^/@]+@/i, "$1"),
          status: value.response?.status,
          statusText: value.response?.statusText,
          response: value.response?.data,
          cause: value.cause,
        },
        depth + 1,
      );
    }
    if (value instanceof Error) {
      return serialize({ type: value.name, message: value.message, cause: value.cause }, depth + 1);
    }
    if (Array.isArray(value)) return value.map((item) => serialize(item, depth + 1));
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        cleanText(key),
        sensitiveKey.test(key) ? hidden : serialize(item, depth + 1),
      ]),
    );
  }

  const result = JSON.stringify(serialize(error, 0), null, 2) ?? "Невідома помилка";
  const limit = 24000;
  return result.length > limit ? `${result.slice(0, limit)}\n[довгу відповідь скорочено]` : result;
}
