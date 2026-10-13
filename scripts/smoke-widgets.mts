import type {
  BrowserTarget,
  EvaluationResult,
  ProtocolMessage,
  Waiter,
} from "./lib/browser-types.mts";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const chrome = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
type PageState = {
  path: string;
  width: number;
  title: string;
  headings: string[];
  mainText: string;
  header: boolean;
  footer: boolean;
  tourLink: string | null;
  forms: number;
};
type SmokeResult = {
  route?: string;
  faqToggled?: boolean;
  navigation?: string | boolean;
  [key: string]: unknown;
};
const results: SmokeResult[] = [];
const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3007";
const reportPrefix = process.env.SMOKE_REPORT_PREFIX || "reports/refactor/stage-7";
const profile = await mkdtemp(path.join(os.tmpdir(), "rich-tour-rsc-"));
const processChrome = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-gpu-sandbox",
    "--no-sandbox",
    "--disable-features=Vulkan,SkiaGraphite",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    "--remote-allow-origins=*",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);
let chromeStderr = "";
processChrome.stderr.on("data", (data) => {
  chromeStderr += data.toString();
});

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
async function until<T>(check: () => T | Promise<T>, timeout = 15000): Promise<NonNullable<T>> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await check();
    if (result) return result as NonNullable<T>;
    await pause(100);
  }
  throw new Error("Timed out waiting for browser state");
}

try {
  const port = await until(async () => {
    try {
      const content = await readFile(path.join(profile, "DevToolsActivePort"), "utf8");
      return Number(content.split("\n")[0]);
    } catch {
      return null;
    }
  });
  const targets = (await (
    await fetch(`http://127.0.0.1:${port}/json/list`, {
      signal: AbortSignal.timeout(10000),
    })
  ).json()) as BrowserTarget[];
  const target = targets.find((item) => item.type === "page");
  if (!target) throw new Error("Browser page target unavailable");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map<number, Waiter>();
  const browserErrors: string[] = [];
  socket.addEventListener("close", (event) => {
    for (const waiter of pending.values())
      waiter.reject(
        new Error(
          `Browser connection closed: ${event.code} ${event.reason}; ${chromeStderr.slice(-1000)}`,
        ),
      );
    pending.clear();
  });
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(String(data)) as ProtocolMessage;
    if ("id" in message) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
    } else if (message.method === "Runtime.exceptionThrown") {
      browserErrors.push(message.params.exceptionDetails.text);
    } else if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      browserErrors.push(message.params.args.map((arg) => arg.value || arg.description).join(" "));
    } else if (message.method === "Fetch.requestPaused") {
      void send("Fetch.fulfillRequest", {
        requestId: message.params.requestId,
        responseCode: 200,
        responseHeaders: [{ name: "Content-Type", value: "application/json" }],
        body: Buffer.from('{"eur":45.5,"usd":40}').toString("base64"),
      });
    }
  });
  function send<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const id = ++sequence;
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timed out: ${method}; ${chromeStderr.slice(-1000)}`));
      }, 10000);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value as T);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate<T = unknown>(expression: string): Promise<T> {
    const result = await send<EvaluationResult<T>>("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function viewport(width: number, height: number) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 700,
    });
  }
  async function navigate(route: string) {
    await send("Page.navigate", { url: `${baseUrl}${route}` });
    await until(() => evaluate("document.readyState === 'complete'"));
    await until(() => evaluate("!!document.querySelector('footer')"));
    await until(() => evaluate("document.querySelector('header')?.getClientRects().length > 0"));
    await until(() =>
      evaluate("getComputedStyle(document.querySelector('header > div')).opacity === '1'"),
    );
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: `${baseUrl}/api/currency*` }] });

  for (const [width, height] of [
    [1365, 768],
    [390, 844],
  ]) {
    await viewport(width, height);
    for (const route of [
      "/",
      "/step",
      "/about",
      "/contacts",
      "/corporate",
      "/reviews",
      "/tours",
      "/search",
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/agent",
      "/agency",
      "/tours/stage7-missing-tour",
    ]) {
      await navigate(route);
      await until(() => evaluate("document.querySelector('main')?.innerText.trim().length > 0"));
      const state = await evaluate<PageState>(
        `({ path: location.pathname, width: innerWidth, title: document.title, headings: [...document.querySelectorAll('main h1, main h2')].map(x => x.textContent), mainText: document.querySelector('main')?.innerText.slice(0, 160), header: !!document.querySelector('header'), footer: !!document.querySelector('footer'), tourLink: [...document.querySelectorAll('main a')].map(a=>a.getAttribute('href')).find(href=>href?.startsWith('/tours/')) || null, forms: document.querySelectorAll('main form').length })`,
      );
      assert.ok(state.header && state.footer);
      if (route === "/agent" || route === "/agency") assert.equal(state.path, "/auth/sign-in");
      else assert.equal(state.path, route);
      if (route.startsWith("/auth/")) assert.ok(state.forms > 0);
      results.push({ route, ...state });
      if (route === "/") {
        const colors = await evaluate<{ main: string; background: string; text: string }>(
          `({ main: getComputedStyle(document.documentElement).getPropertyValue('--main').trim(), background: getComputedStyle(document.body).backgroundColor, text: getComputedStyle(document.body).color })`,
        );
        assert.deepEqual(colors, {
          main: "#e43a3a",
          background: "rgb(255, 255, 255)",
          text: "rgb(24, 24, 27)",
        });
        results.push({ width, colors });
      }
      if (route === "/tours" && state.tourLink) {
        await navigate(state.tourLink);
        const tour = await evaluate<{ path: string; headings: string[]; calendars: number }>(
          `({ path: location.pathname, headings: [...document.querySelectorAll('main h1, main h2')].map(x => x.textContent), calendars: document.querySelectorAll('[role=grid]').length })`,
        );
        assert.ok(!tour.headings.includes("404"));
        assert.ok(tour.headings.length > 0);
        results.push({ width, tour });
      }
      if (route === "/" || route === "/agent") {
        await until(() =>
          evaluate("getComputedStyle(document.querySelector('main h1')).opacity === '1'"),
        );
        const image = await send<{ data: string }>("Page.captureScreenshot", { format: "png" });
        const { writeFile } = await import("node:fs/promises");
        await writeFile(
          `${reportPrefix}-${route === "/" ? "home" : "sign-in"}-${width}.png`,
          Buffer.from(image.data, "base64"),
        );
      }
    }
    await navigate("/");
    const faqCount = await evaluate<number>("document.querySelectorAll('#faq li').length");
    if (faqCount) {
      await evaluate("document.querySelector('#faq li')?.click()");
      await until(() =>
        evaluate(
          "(() => { const panel = document.querySelector('#faq li .grid'); const content = panel?.firstElementChild; return panel && content && panel.clientHeight > 0 && panel.clientHeight >= content.scrollHeight; })()",
        ),
      );
      results.push({ width, faqToggled: true });
    } else {
      results.push({ width, faqToggled: false, reason: "No FAQ entries returned by Sanity" });
    }
    if (width < 700) {
      await evaluate("document.querySelector('button[aria-label=\"open menu button\"]')?.click()");
      await until(() => evaluate("!!document.querySelector('.no-doc-scroll')"));
      await evaluate("document.querySelector('.no-doc-scroll a[href=\"/step\"]')?.click()");
    } else {
      await evaluate(
        "[...document.querySelectorAll('header a[href=\"/step\"]')].find(a=>a.getClientRects().length)?.click()",
      );
    }
    await until(() => evaluate("location.pathname === '/step'"));
    results.push({ width, navigation: await evaluate<string>("location.pathname") });
  }
  results.push({ browserErrors });
  assert.ok(!browserErrors.some((error) => /hydrat|uncaught|react error/i.test(error)));
  const { writeFile } = await import("node:fs/promises");
  await writeFile(`${reportPrefix}-browser-smoke.json`, JSON.stringify(results, null, 2) + "\n");
  console.log(
    JSON.stringify(
      {
        pageChecks: results.filter((result) => result.route).length,
        interactions: results.filter((result) => result.faqToggled || result.navigation).length,
        browserErrors,
      },
      null,
      2,
    ),
  );

  socket.close();
} finally {
  processChrome.kill();
  const resolved = path.resolve(profile);
  if (!resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)) {
    throw new Error("Unexpected browser profile path");
  }
  await rm(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
