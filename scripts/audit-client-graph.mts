import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { builtinModules } from "node:module";

const root = process.cwd();
const srcRoot = path.join(root, "src");
const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];
const inspected = new Map<string, { client: boolean; imports: string[] }>();

function resolveLocal(source: string, specifier: string) {
  const base = specifier.startsWith("@/")
    ? path.join(srcRoot, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(source), specifier)
      : null;
  if (!base) return null;
  const candidates = [
    base,
    ...extensions.map((ext) => `${base}${ext}`),
    ...extensions.map((ext) => path.join(base, `index${ext}`)),
  ];
  const resolved = candidates.find(
    (candidate) => existsSync(candidate) && extensions.includes(path.extname(candidate)),
  );
  if (!resolved) throw new Error(`Unresolved import ${specifier} in ${source}`);
  return resolved;
}

function inspect(file: string) {
  if (inspected.has(file)) return inspected.get(file)!;
  const source = readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports: string[] = [];
  function visit(node: ts.Node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      !(ts.isImportDeclaration(node) ? node.importClause?.isTypeOnly : node.isTypeOnly)
    ) {
      imports.push(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      imports.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  const result = {
    client: ast.statements.some(
      (statement) =>
        ts.isExpressionStatement(statement) &&
        ts.isStringLiteral(statement.expression) &&
        statement.expression.text === "use client",
    ),
    imports,
  };
  inspected.set(file, result);
  return result;
}

function graph(entry: string) {
  const files = new Set<string>();
  const packages = new Set<string>();
  const unresolved = [];
  const stack = [path.resolve(root, entry)];
  while (stack.length) {
    const file = stack.pop()!;
    if (files.has(file)) continue;
    files.add(file);
    for (const specifier of inspect(file).imports) {
      if (specifier.startsWith(".") || specifier.startsWith("@/")) {
        if (specifier.endsWith(".css")) continue;
        try {
          const resolved = resolveLocal(file, specifier);
          if (resolved) stack.push(resolved);
        } catch (error) {
          unresolved.push(error instanceof Error ? error.message : String(error));
        }
      } else {
        packages.add(specifier);
      }
    }
  }
  return {
    entry,
    sourceFiles: files.size,
    files: [...files].map((file) => path.relative(root, file).replaceAll("\\", "/")).sort(),
    packages: [...packages].sort(),
    unresolved,
    serverModules: [...packages].filter(
      (specifier) =>
        specifier === "server-only" || builtinModules.includes(specifier.replace(/^node:/, "")),
    ),
  };
}

const entries = process.argv.slice(2);
if (!entries.length) throw new Error("Pass one or more source files as arguments");
const results = entries.map(graph);
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
if (results.some((result) => result.unresolved.length || result.serverModules.length))
  process.exitCode = 1;
