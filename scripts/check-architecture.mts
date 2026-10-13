import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src");
const layers = ["app", "widgets", "features", "entities", "shared"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".cts", ".cjs"]);

function location(file: string) {
  const relative = path.relative(srcRoot, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  const parts = relative.split(path.sep);
  if (layers.includes(parts[0])) {
    return { layer: parts[0], slice: parts[0] === "app" ? null : parts[1], parts, legacy: false };
  }
  const relativePath = parts.join("/");
  // Assign retained physical paths to their logical layer. Legacy modules are
  // individually addressable until the directory cleanup; no source is skipped.
  let layer: string;
  let slice: string;
  if (parts[0] === "components") {
    if (parts[1] !== "shared") {
      layer = "widgets";
      slice = `legacy-${parts[1]}`;
    } else if (["forms", "search", "booking"].includes(parts[2])) {
      layer = "features";
      slice = `legacy-${parts[2]}`;
    } else if (parts[2] === "cards") {
      layer = "entities";
      slice = "review";
    } else {
      layer = "shared";
      slice = "ui";
    }
  } else if (parts[0] === "schemas" || parts[0] === "contracts") {
    layer = "features";
    slice = `legacy-${parts[0]}`;
  } else if (parts[0] === "lib") {
    if (/^lib\/sanity\/users\/getAuth.*Profile/.test(relativePath)) {
      layer = "features";
      slice = "auth";
    } else if (relativePath.startsWith("lib/sanity/users/repository")) {
      layer = "entities";
      slice = "user";
    } else if (/^lib\/crm\/get.*Orders/.test(relativePath)) {
      layer = "entities";
      slice = "order";
    } else if (relativePath.startsWith("lib/crm/agentSync")) {
      layer = "features";
      slice = "auth";
    } else if (
      parts[1] === "api" ||
      (parts[1] === "crm" && !["utils", "users"].includes(parts[2]))
    ) {
      layer = "features";
      slice = "booking";
    } else {
      layer = "shared";
      slice = "lib";
    }
  } else if (["hooks", "context", "regex", "utils", "constants"].includes(parts[0])) {
    layer = "shared";
    slice = "lib";
  } else if (relativePath === "proxy.ts") {
    layer = "app";
    slice = "proxy";
  } else {
    return { layer: "unclassified", slice: null, parts, legacy: true };
  }
  return { layer, slice, parts, legacy: true };
}

function targetPath(sourceFile: string, specifier: string) {
  if (specifier.startsWith("@/")) return path.resolve(srcRoot, specifier.slice(2));
  if (specifier.startsWith(".")) return path.resolve(path.dirname(sourceFile), specifier);
  return null;
}

export function checkImport(sourceFile: string, specifier: string) {
  const source = location(sourceFile);
  const targetFile = targetPath(sourceFile, specifier);
  const target = targetFile && location(targetFile);
  if (!source || !target) return null;

  if (source.layer === "unclassified" || target.layer === "unclassified")
    return "unclassified source path";
  const sourceRank = layers.indexOf(source.layer);
  const targetRank = layers.indexOf(target.layer);
  if (targetRank < sourceRank) return `upward import into ${target.layer}`;
  if (target.layer === "app") return null;
  if (!target.slice) return `missing slice in ${target.layer}`;
  if (source.layer === target.layer && source.slice === target.slice) return null;

  if (target.legacy) return null;
  const tail = target.parts.slice(2);
  const entry =
    tail.length === 0 ||
    (tail.length === 1 &&
      ["index", "server", "users-server", "crm-server"].includes(tail[0].replace(/\.[^.]+$/, "")));
  if (!entry) return `import through a private file of ${target.layer}/${target.slice}`;
  return null;
}

async function* sourceFiles(directory: string): AsyncGenerator<string> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(file);
    else if (entry.isFile() && extensions.has(path.extname(file))) yield file;
  }
}

function moduleSpecifiers(node: ts.Node, found: Array<{ specifier: string; start: number }>) {
  if (
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier &&
    ts.isStringLiteral(node.moduleSpecifier)
  ) {
    found.push({ specifier: node.moduleSpecifier.text, start: node.moduleSpecifier.getStart() });
  }
  if (
    ts.isCallExpression(node) &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0]) &&
    (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
      (ts.isIdentifier(node.expression) && node.expression.text === "require"))
  ) {
    found.push({ specifier: node.arguments[0].text, start: node.arguments[0].getStart() });
  }
  ts.forEachChild(node, (child) => moduleSpecifiers(child, found));
}

export async function checkArchitecture() {
  const files: string[] = [];
  for await (const file of sourceFiles(srcRoot)) files.push(file);
  const results = await Promise.all(
    files.map(async (file) => {
      const violations: string[] = [];
      if (location(file)?.layer === "unclassified")
        violations.push(`${path.relative(root, file)}: unclassified source path`);
      if ([".js", ".jsx", ".mjs", ".cjs"].includes(path.extname(file)))
        violations.push(`${path.relative(root, file)}: untyped source file`);
      const ast = ts.createSourceFile(
        file,
        await readFile(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      );
      const imports: Array<{ specifier: string; start: number }> = [];
      moduleSpecifiers(ast, imports);
      for (const item of imports) {
        const reason = checkImport(file, item.specifier);
        if (reason) {
          const line = ast.getLineAndCharacterOfPosition(item.start).line + 1;
          violations.push(`${path.relative(root, file)}:${line}: ${item.specifier}: ${reason}`);
        }
      }
      return violations;
    }),
  );
  return { checked: files.length, violations: results.flat().sort() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { checked, violations } = await checkArchitecture();
  for (const violation of violations) console.error(violation);
  console.log(`Architecture: checked ${checked} source files; ${violations.length} violations.`);
  if (violations.length) process.exitCode = 1;
}
