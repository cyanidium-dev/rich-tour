export type TourImageSource = {
  url?: string;
  asset?: { url?: string };
  displayCrops?: Record<string, { left?: number; top?: number; right?: number; bottom?: number }>;
};

/** Resolve a saved Sanity crop without changing the original asset or legacy URLs. */
export function tourImageUrl(
  image: TourImageSource | undefined,
  preset: string,
): string | undefined {
  const source = image?.url ?? image?.asset?.url;
  const crop = image?.displayCrops?.[preset];
  if (!source || !crop) return source;
  const sides = [crop.left, crop.top, crop.right, crop.bottom];
  if (
    sides.some(
      (side) => typeof side !== "number" || !Number.isFinite(side) || side < 0 || side >= 1,
    )
  )
    return source;
  try {
    const url = new URL(source);
    if (url.hostname !== "cdn.sanity.io") return source;
    const match = url.pathname.match(/-(\d+)x(\d+)\.[a-z0-9]+$/i);
    if (!match) return source;
    const imageWidth = Number(match[1]);
    const imageHeight = Number(match[2]);
    const x = Math.round(imageWidth * crop.left!);
    const y = Math.round(imageHeight * crop.top!);
    const width = imageWidth - x - Math.round(imageWidth * crop.right!);
    const height = imageHeight - y - Math.round(imageHeight * crop.bottom!);
    if (width <= 0 || height <= 0) return source;
    url.searchParams.set("rect", `${x},${y},${width},${height}`);
    return url.toString();
  } catch {
    return source;
  }
}
