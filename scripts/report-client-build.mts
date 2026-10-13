import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const nextDir = path.resolve(".next");
const serverAppDir = path.join(nextDir, "server", "app");
const staticDir = path.join(nextDir, "static");

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(fullPath) : [fullPath];
    }),
  );
  return nested.flat();
}

async function sizes(files: string[]) {
  let bytes = 0;
  let gzipBytes = 0;
  for (const file of files) {
    const data = await readFile(file);
    bytes += data.length;
    gzipBytes += gzipSync(data).length;
  }
  return { files: files.length, bytes, gzipBytes };
}

const manifests = (await walk(serverAppDir)).filter((file) =>
  file.endsWith("_client-reference-manifest.js"),
);
const routes: Record<
  string,
  { clientReferences: number; files: number; bytes: number; gzipBytes: number }
> = {};
for (const file of manifests) {
  const source = await readFile(file, "utf8");
  const match = source.match(/__RSC_MANIFEST\["([^"]+)"\] = (\{.*\});?\s*$/s);
  if (!match) throw new Error(`Cannot parse ${file}`);
  const manifest = JSON.parse(match[2]) as { clientModules: Record<string, { chunks: string[] }> };
  const chunks = new Set(Object.values(manifest.clientModules).flatMap((item) => item.chunks));
  const files = [...chunks]
    .filter((chunk) => chunk.startsWith("/_next/static/") && chunk.endsWith(".js"))
    .map((chunk) => path.join(nextDir, chunk.slice("/_next/".length)));
  routes[match[1]] = {
    clientReferences: Object.keys(manifest.clientModules).length,
    ...(await sizes(files)),
  };
}

const allStaticJs = (await walk(staticDir)).filter((file) => file.endsWith(".js"));
process.stdout.write(
  `${JSON.stringify({ allStaticJs: await sizes(allStaticJs), routes }, null, 2)}\n`,
);
