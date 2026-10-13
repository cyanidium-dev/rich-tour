import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { checkArchitecture, checkImport } from "./check-architecture.mts";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const source = (file: string) => path.join(src, file);

describe("imports throughout src", () => {
  it("allows downward imports through public entries", () => {
    expect(checkImport(source("widgets/header/ui/Header.tsx"), "@/features/auth")).toBeNull();
    expect(
      checkImport(source("features/booking/ui/Form.tsx"), "@/entities/tour/server"),
    ).toBeNull();
    expect(checkImport(source("entities/tour/ui/Card.tsx"), "../model/formatTour")).toBeNull();
  });

  it("rejects upward and private cross-slice imports", () => {
    expect(checkImport(source("entities/tour/model/tour.ts"), "@/features/booking")).toMatch(
      /upward/,
    );
    expect(
      checkImport(source("features/booking/ui/Form.tsx"), "@/entities/tour/model/tour"),
    ).toMatch(/private/);
    expect(
      checkImport(source("features/booking/ui/Form.tsx"), "@/features/auth/model/session"),
    ).toMatch(/private/);
    expect(checkImport(source("shared/ui/Button.tsx"), "@/app/page")).toMatch(/upward/);
  });

  it("checks legacy sources and targets by their logical layer", () => {
    expect(
      checkImport(source("widgets/header/ui/Header.tsx"), "@/components/shared/icons/IconCross"),
    ).toBeNull();
    expect(checkImport(source("components/shared/icons/IconCross.tsx"), "@/features/auth")).toMatch(
      /upward/,
    );
    expect(checkImport(source("shared/ui/Button.tsx"), "@/components/tours/Tours")).toMatch(
      /upward/,
    );
    expect(
      checkImport(source("components/search/Search.tsx"), "@/entities/tour/model/types"),
    ).toMatch(/private/);
    expect(checkImport(source("lib/sanity/users/repository.ts"), "@/widgets/account-menu")).toMatch(
      /upward/,
    );
    expect(
      checkImport(source("schemas/loginFormValidation.ts"), "@/features/auth/model/schemas"),
    ).toMatch(/private/);
    expect(checkImport(source("unknown/logic.ts"), "@/shared/ui")).toMatch(/unclassified/);
  });

  it("checks the current source tree", async () => {
    const result = await checkArchitecture();
    expect(result.checked).toBeGreaterThan(400);
    expect(result.violations).toEqual([]);
  }, 20000);
});
