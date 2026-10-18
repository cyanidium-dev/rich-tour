import { describe, expect, it } from "vitest";
import {
  canRemoveLegacyGallery,
  imageSlots,
  planTourImageMigration,
  type LegacyImage,
  type TourImageDocument,
} from "./tour-image-migration.mts";

const photo = (index: number): LegacyImage => ({
  _key: `photo-${index}`,
  _type: "image",
  asset: { _type: "reference", _ref: `image-photo${index}-2400x1200-jpg` },
});

const documentWith = (count: number, draft = false): TourImageDocument => ({
  _id: `${draft ? "drafts." : ""}tour-1`,
  _rev: "revision-1",
  gallery: Array.from({ length: count }, (_, index) => photo(index)),
});

describe("tour image migration", () => {
  it.each([0, 1, 2, 3, 4, 5, 6])("moves %i legacy images to their exact slots", (count) => {
    const fields = planTourImageMigration(documentWith(count));
    imageSlots.forEach(([name], index) => {
      expect(Boolean(fields[name])).toBe(index < count);
      if (index < count) {
        const image = fields[name] as LegacyImage;
        expect(image.asset?._ref).toBe(photo(index).asset?._ref);
        expect(image._key).toBeUndefined();
      }
    });
  });

  it("refuses to discard photos beyond the sixth", () => {
    const document = documentWith(7);
    expect(() => planTourImageMigration(document)).toThrow("more than six photos");
    expect(canRemoveLegacyGallery(document)).toBe(false);
  });

  it("creates crops for desktop and mobile positions using the new dimensions", () => {
    const fields = planTourImageMigration(documentWith(6));
    expect((fields.heroMainImage as LegacyImage).displayCrops).toHaveProperty("heroDesktop");
    expect((fields.heroMainImage as LegacyImage).displayCrops).toHaveProperty("heroMobile");
    expect((fields.benefitsImage as LegacyImage).displayCrops).toHaveProperty("benefitsMobile");
  });

  it("is repeatable and preserves manually filled slots in published documents and drafts", () => {
    for (const draft of [false, true]) {
      const document = documentWith(6, draft);
      document.heroMainImage = photo(0);
      const first = planTourImageMigration(document);
      expect(first.heroMainImage).toBeUndefined();
      const second = planTourImageMigration({ ...document, ...first });
      expect(second).toEqual({});
      const migrated = { ...document, ...first };
      expect(canRemoveLegacyGallery(migrated)).toBe(true);
    }
  });

  it("does not allow cleanup until all sourced images have been copied", () => {
    const document = documentWith(6);
    expect(canRemoveLegacyGallery(document)).toBe(false);
    const migrated = { ...document, ...planTourImageMigration(document) };
    delete migrated.benefitsImage;
    expect(canRemoveLegacyGallery(migrated)).toBe(false);
    migrated.benefitsImage = photo(99);
    expect(canRemoveLegacyGallery(migrated)).toBe(false);
  });
});
