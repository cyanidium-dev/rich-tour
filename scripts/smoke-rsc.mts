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
    await send("Page.navigate", { url: `http://localhost:3000${route}` });
    await until(() => evaluate("document.readyState === 'complete'"));
    await until(() => evaluate("!!document.querySelector('footer')"));
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*://localhost:3000/api/currency*" }] });

  await viewport(1440, 900);
  await navigate("/contacts");
  await until(() => evaluate("document.querySelector('header')?.getClientRects().length > 0"));
  const desktop = await evaluate<{
    path: string;
    desktopHeader: string;
    footerText: string;
    navLinks: string[];
  }>(`({
    path: location.pathname,
    desktopHeader: getComputedStyle(document.querySelector('header .hidden')).display,
    footerText: document.querySelector('footer')?.innerText.slice(0, 180),
    navLinks: [...document.querySelectorAll('header a')].filter(a => getComputedStyle(a).display !== 'none').map(a => a.getAttribute('href')),
    currencyButtons: [...document.querySelectorAll('header button')].map(b => b.innerText).filter(t => t.includes('EUR') || t.includes('UAH'))
  })`);
  console.log("desktop", JSON.stringify(desktop));
  assert.equal(desktop.path, "/contacts");
  assert.equal(desktop.desktopHeader, "flex");
  assert.ok(desktop.navLinks.includes("/step"));
  assert.ok(desktop.footerText.includes("Адреса"));
  await evaluate(`[...document.querySelectorAll('header button')]
    .find(b => b.getClientRects().length && b.innerText.includes('EUR/UAH'))?.click()`);
  await until(() => evaluate("!!document.querySelector('[role=menuitemradio][data-key=USD]')"));
  await evaluate("document.querySelector('[role=menuitemradio][data-key=USD]').click()");
  await until(() =>
    evaluate(
      "[...document.querySelectorAll('header button')].some(b => b.getClientRects().length && b.innerText.includes('EUR/USD'))",
    ),
  );
  console.log("desktopCurrency", "EUR/USD selected");
  await evaluate(`[...document.querySelectorAll('header a[href="/step"]')]
    .find(a => a.getClientRects().length)?.click()`);
  await until(() => evaluate("location.pathname === '/step'"));
  console.log("desktopNavigation", await evaluate("location.pathname"));

  await viewport(390, 844);
  await navigate("/contacts");
  await until(() => evaluate("document.querySelector('header')?.getClientRects().length > 0"));
  const mobileBefore = await evaluate(`({
    path: location.pathname,
    menuVisible: !!document.querySelector('.no-doc-scroll'),
    button: document.querySelector('button[aria-label="open menu button"]')?.outerHTML.slice(0, 150),
    currencyButtons: [...document.querySelectorAll('header button')].map(b => b.innerText).filter(t => t.includes('EUR') || t.includes('UAH'))
  })`);
  await evaluate("document.querySelector('button[aria-label=\"open menu button\"]')?.click()");
  const mobileAfter = await until(async () => {
    const state = await evaluate<{ open: boolean; links: string[] }>(`({
      open: !!document.querySelector('.no-doc-scroll'),
      links: [...document.querySelectorAll('.no-doc-scroll a')].map(a => a.getAttribute('href'))
    })`);
    return state.open ? state : null;
  });
  console.log("mobile", JSON.stringify({ before: mobileBefore, after: mobileAfter }));
  assert.ok(mobileAfter.links.includes("/step"));
  await evaluate("document.querySelector('.no-doc-scroll a[href=\"/step\"]')?.click()");
  await until(() => evaluate("location.pathname === '/step'"));
  await until(() =>
    evaluate(`(() => {
    const menu = document.querySelector('.no-doc-scroll');
    return !menu || Number(getComputedStyle(menu).opacity) < 0.01;
  })()`),
  );
  await evaluate("document.querySelector('footer')?.scrollIntoView()");
  await until(() =>
    evaluate("getComputedStyle(document.querySelector('footer > div')).opacity === '1'"),
  );
  console.log(
    "mobileNavigationAndFooter",
    await evaluate(`({
    path: location.pathname,
    menuClosed: !document.querySelector('.no-doc-scroll') || Number(getComputedStyle(document.querySelector('.no-doc-scroll')).opacity) < 0.01,
    footerOpacity: getComputedStyle(document.querySelector('footer > div')).opacity,
    footerAddress: document.querySelector('footer')?.innerText.includes('Адреса')
  })`),
  );
  console.log("browserErrors", JSON.stringify(browserErrors));
  assert.ok(!browserErrors.some((error) => /hydrat|uncaught|react error/i.test(error)));
  socket.close();
} finally {
  processChrome.kill();
  const resolved = path.resolve(profile);
  if (!resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)) {
    throw new Error("Unexpected browser profile path");
  }
  await rm(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
