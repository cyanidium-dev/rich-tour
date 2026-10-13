import { describe, expect, it } from "vitest";
import { tourImageUrl } from "./tourImageUrl";

const original = "https://cdn.sanity.io/images/project/production/example-2400x1200.jpg";

describe("tourImageUrl", () => {
  it("uses the selected frame from a single asset", () => {
    const image = {
      asset: { url: original },
      displayCrops: {
        wide: { left: 0.1, top: 0, right: 0.1, bottom: 0 },
        portrait: { left: 0.3, top: 0, right: 0.3, bottom: 0 },
      },
    };
    expect(tourImageUrl(image, "wide")).toContain("rect=240%2C0%2C1920%2C1200");
    expect(tourImageUrl(image, "portrait")).toContain("rect=720%2C0%2C960%2C1200");
  });

  it("keeps old images and invalid crops unchanged", () => {
    expect(tourImageUrl({ asset: { url: original } }, "wide")).toBe(original);
    expect(
      tourImageUrl(
        { url: "legacy.jpg", displayCrops: { wide: { left: 0, top: 0, right: 0, bottom: 0 } } },
        "wide",
      ),
    ).toBe("legacy.jpg");
    expect(
      tourImageUrl(
        { url: original, displayCrops: { wide: { left: 0.8, top: 0, right: 0.8, bottom: 0 } } },
        "wide",
      ),
    ).toBe(original);
  });
});
