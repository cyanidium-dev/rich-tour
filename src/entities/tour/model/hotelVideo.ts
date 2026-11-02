import type { HotelDescriptionBlock, HotelVideoBlock } from "./types";

function isSanityFileUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "cdn.sanity.io" &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname.startsWith("/files/")
    );
  } catch {
    return false;
  }
}

export function isHotelVideoBlock(block: HotelDescriptionBlock): block is HotelVideoBlock {
  if (block._type === "hotelYoutube") {
    return typeof block.videoId === "string" && /^[A-Za-z0-9_-]{11}$/.test(block.videoId);
  }
  return (
    block._type === "hotelVideoFile" &&
    isSanityFileUrl(block.url) &&
    block.mimeType === "video/mp4" &&
    typeof block.size === "number" &&
    block.size > 0 &&
    block.size <= 100_000_000
  );
}

export function hotelDescriptionVideos(blocks: HotelDescriptionBlock[]) {
  return blocks.filter(isHotelVideoBlock);
}
