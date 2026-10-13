import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import ts from "typescript";

async function flags(script: string) {
  const code = await readFile(new URL(script, import.meta.url), "utf8");
  const ast = ts.createSourceFile(script, code, ts.ScriptTarget.Latest, true);
  let required: string[] = [];
  let condition: ts.Expression | undefined;
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      if (
        declaration.name.text === "APPLY_FLAGS" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        required = declaration.initializer.elements.map((element) => {
          if (!ts.isStringLiteral(element)) throw new Error("Expected a literal confirmation flag");
          return element.text;
        });
      }
      if (declaration.name.text === "shouldApply") condition = declaration.initializer;
    }
  }
  return { required, condition: condition?.getText(ast) };
}

describe("operational command contracts (without executing migrations)", () => {
  it("requires every migration and cleanup confirmation", async () => {
    const migrate = await flags("./migrate-users-dataset.mts");
    const cleanup = await flags("./cleanup-source-users.mts");
    const display = await flags("./backfill-user-display.mts");
    expect(migrate.required).toEqual([
      "--apply",
      "--confirm-copy-users",
      "--confirm-reset-missing-passwords",
    ]);
    expect(cleanup.required).toEqual(["--apply", "--confirm-delete-source-users"]);
    expect(display.required).toEqual(["--apply", "--confirm-public-labels"]);
    for (const script of [migrate, cleanup, display]) {
      expect(script.condition).toBe("APPLY_FLAGS.every((flag) => process.argv.includes(flag))");
    }
  });

  it("keeps plan/apply/reset commands and their environment loading", async () => {
    const manifest = JSON.parse(
      await readFile(new URL("../package.json", import.meta.url), "utf8"),
    ) as { scripts: Record<string, string> };
    expect(manifest.scripts["users:migrate:plan"]).toBe(
      "node --env-file=.env.local scripts/migrate-users-dataset.mts",
    );
    expect(manifest.scripts["users:migrate:plan-with-resets"]).toBe(
      `${manifest.scripts["users:migrate:plan"]} --reset-missing-plain`,
    );
    expect(manifest.scripts["users:migrate:apply"]).toBe(
      `${manifest.scripts["users:migrate:plan-with-resets"]} --apply --confirm-copy-users --confirm-reset-missing-passwords`,
    );
    expect(manifest.scripts["users:cleanup:plan"]).toBe(
      "node --env-file=.env.local scripts/cleanup-source-users.mts",
    );
    expect(manifest.scripts["users:cleanup:apply"]).toBe(
      `${manifest.scripts["users:cleanup:plan"]} --apply --confirm-delete-source-users`,
    );
    expect(manifest.scripts["users:display:plan"]).toBe(
      "node --env-file=.env.local scripts/backfill-user-display.mts",
    );
    expect(manifest.scripts["users:display:apply"]).toBe(
      `${manifest.scripts["users:display:plan"]} --apply --confirm-public-labels`,
    );
  });
});
