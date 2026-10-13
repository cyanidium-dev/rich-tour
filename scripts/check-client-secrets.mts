import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const envFile = path.resolve(".env.local");
if (!existsSync(envFile)) {
  console.log("Client secret scan skipped: .env.local is unavailable.");
  process.exit(0);
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(file) : [file];
    }),
  );
  return nested.flat();
}

const keys = [...(await readFile(envFile, "utf8")).matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)]
  .map((match) => match[1])
  .filter((key) => !key.startsWith("NEXT_PUBLIC_"));
const values = keys
  .map((key): [string, string | undefined] => [key, process.env[key]])
  .filter((item): item is [string, string] => Boolean(item[1] && item[1].length >= 12));
const chunks = await Promise.all(
  (await walk(path.resolve(".next/static")))
    .filter((file) => file.endsWith(".js"))
    .map((file) => readFile(file)),
);
const matches = values.filter(([, value]) =>
  chunks.some((chunk) => chunk.includes(Buffer.from(value))),
);
console.log(
  `Client secret scan: ${values.length} private environment values checked; ${matches.length} matches.`,
);
for (const [key] of matches) console.error(`Value for ${key} found in client JS.`);
if (matches.length) process.exitCode = 1;
