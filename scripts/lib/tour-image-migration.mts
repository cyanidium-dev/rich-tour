type CropPreset = { id: string; width: number; height: number };
type CropRect = { left: number; top: number; right: number; bottom: number };

// Snapshot of the Studio's placement sizes for this one-time migration.
const heroMainPresets = [
  { id: "heroDesktop", width: 645, height: 300 },
  { id: "heroMobile", width: 342, height: 184 },
];
const heroLeftPresets = [
  { id: "heroLeft", width: 454, height: 244 },
  { id: "mobile", width: 342, height: 184 },
];
const heroRightPresets = [
  { id: "heroRight", width: 645, height: 244 },
  { id: "mobile", width: 342, height: 184 },
];
const benefitsPresets = [
  { id: "benefits", width: 600, height: 350 },
  { id: "benefitsMobile", width: 342, height: 234 },
];
const costShortPresets = [{ id: "costShort", width: 360, height: 544 }];
const costTallPresets = [{ id: "costTall", width: 360, height: 702 }];

function makeCrop(ref: string, preset: CropPreset, focusX = 0.5, focusY = 0.5): CropRect | null {
  const match = ref.match(/^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return null;
  const sourceAspect = Number(match[1]) / Number(match[2]);
  const targetAspect = preset.width / preset.height;
  const width = sourceAspect > targetAspect ? targetAspect / sourceAspect : 1;
  const height = sourceAspect > targetAspect ? 1 : sourceAspect / targetAspect;
  const left = Math.min(Math.max(focusX - width / 2, 0), 1 - width);
  const top = Math.min(Math.max(focusY - height / 2, 0), 1 - height);
  const round = (value: number) => Math.round(value * 1e6) / 1e6;
  return {
    left: round(left),
    top: round(top),
    right: round(1 - left - width),
    bottom: round(1 - top - height),
  };
}

export type LegacyImage = {
  _key?: string;
  _type?: string;
  asset?: { _ref?: string; _type?: string };
  displayCrops?: Record<string, CropRect>;
  crop?: CropRect;
  hotspot?: { x?: number; y?: number; width?: number; height?: number };
  [key: string]: unknown;
};

export const imageSlots = [
  ["heroMainImage", heroMainPresets],
  ["heroLeftImage", heroLeftPresets],
  ["heroRightImage", heroRightPresets],
  ["benefitsImage", benefitsPresets],
  ["costShortImage", costShortPresets],
  ["costTallImage", costTallPresets],
] as const satisfies ReadonlyArray<readonly [string, CropPreset[]]>;

export type TourImageDocument = {
  _id: string;
  _rev: string;
  gallery?: LegacyImage[];
} & Partial<Record<(typeof imageSlots)[number][0], LegacyImage>>;

function hasAsset(image: LegacyImage | undefined): image is LegacyImage {
  return Boolean(image?.asset?._ref);
}

function toPlacement(image: LegacyImage, presets: CropPreset[]): LegacyImage {
  const { _key: _unused, ...rest } = image;
  void _unused;
  const ref = image.asset!._ref!;
  const displayCrops = { ...image.displayCrops };
  for (const preset of presets) {
    const crop = makeCrop(ref, preset, image.hotspot?.x, image.hotspot?.y);
    if (!displayCrops[preset.id] && crop) displayCrops[preset.id] = crop;
  }
  const primary = displayCrops[presets[0].id];
  return {
    ...rest,
    _type: "image",
    displayCrops,
    ...(primary ? { crop: primary } : {}),
  };
}

export function planTourImageMigration(document: TourImageDocument) {
  const gallery = document.gallery ?? [];
  if (gallery.slice(imageSlots.length).some(hasAsset)) {
    throw new Error(`${document._id}: legacy gallery has more than six photos`);
  }
  const fields: Record<string, LegacyImage> = {};
  imageSlots.forEach(([field, presets], index) => {
    const source = gallery[index];
    if (document[field] == null && hasAsset(source)) {
      fields[field] = toPlacement(source, presets);
    }
  });

  return fields;
}

export function canRemoveLegacyGallery(document: TourImageDocument) {
  if (!document.gallery) return false;
  return document.gallery.every((image, index) => {
    if (!hasAsset(image)) return true;
    return (
      index < imageSlots.length && document[imageSlots[index][0]]?.asset?._ref === image.asset?._ref
    );
  });
}
