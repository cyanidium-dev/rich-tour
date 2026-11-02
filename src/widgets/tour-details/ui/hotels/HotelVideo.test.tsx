// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode, useState, type ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  hotelDescriptionVideos,
  type HotelVideoFileBlock,
  type HotelYoutubeBlock,
} from "@/entities/tour";
import HotelVideo from "./HotelVideo";
import HotelContent from "./HotelContent";
import HotelModal from "./HotelModal";
import HotelModalContent from "./HotelModalContent";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const youtube: HotelYoutubeBlock = {
  _type: "hotelYoutube",
  _key: "youtube",
  videoId: "dQw4w9WgXcQ",
  title: "Огляд",
};
const file: HotelVideoFileBlock = {
  _type: "hotelVideoFile",
  _key: "file",
  url: "https://cdn.sanity.io/files/project/production/video.mp4",
  mimeType: "video/mp4",
  size: 100_000_000,
  title: "Номери",
  posterUrl: "https://cdn.sanity.io/images/project/production/poster.jpg",
};

it("creates a YouTube iframe only on request, with a fixed origin and preview-safe referrer policy", () => {
  const view = render(<HotelVideo value={youtube} />);
  expect(view.container.querySelector("iframe")).toBeNull();
  expect(screen.getByRole("link", { name: "Відкрити на YouTube" }).getAttribute("href")).toBe(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  );
  fireEvent.click(screen.getByRole("button", { name: /Переглянути відео/ }));
  const iframe = screen.getByTitle("Огляд");
  expect(iframe.getAttribute("src")).toBe(
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?playsinline=1",
  );
  expect(iframe.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
  expect(iframe.getAttribute("src")).not.toContain("autoplay");
});

it("renders an inline MP4 with no preloading and reports playback failures", () => {
  const view = render(<HotelVideo value={file} />);
  const video = view.container.querySelector("video")!;
  expect(video.getAttribute("src")).toBe(file.url);
  expect(video.getAttribute("poster")).toBe(file.posterUrl);
  expect(video.hasAttribute("controls")).toBe(true);
  expect(video.hasAttribute("playsinline")).toBe(true);
  expect(video.getAttribute("preload")).toBe("none");
  expect(video.hasAttribute("autoplay")).toBe(false);
  fireEvent.error(video);
  expect(screen.getByRole("alert").textContent).toContain("Не вдалося відтворити");
});

it("keeps the MP4 source available when React Strict Mode replays media cleanup", () => {
  const view = render(
    <StrictMode>
      <HotelVideo value={file} />
    </StrictMode>,
  );
  expect(view.container.querySelector("video")?.getAttribute("src")).toBe(file.url);
});

it("preserves the order of paragraphs and multiple videos", () => {
  const view = render(
    <HotelContent
      value={[
        { _type: "block", _key: "before", children: [{ _type: "span", text: "Перед відео" }] },
        youtube,
        { _type: "block", _key: "after", children: [{ _type: "span", text: "Після відео" }] },
        file,
      ]}
    />,
  );
  expect(Array.from(view.container.children).map((node) => node.tagName)).toEqual([
    "P",
    "FIGURE",
    "P",
    "FIGURE",
  ]);
});

it("omits invalid or unresolved videos and excludes them from the card video action", () => {
  const invalid = [
    { ...youtube, videoId: 'bad"><script>' },
    { ...file, url: "javascript:alert(1)" },
    { ...file, size: 100_000_001 },
    { ...file, mimeType: "video/quicktime" },
    { _type: "hotelVideoFile", asset: { _ref: "missing" } },
  ];
  expect(hotelDescriptionVideos(invalid)).toEqual([]);
  const view = render(<HotelContent value={invalid} />);
  expect(view.container.querySelector("iframe, video, script, button")).toBeNull();
});

it("unmounts both players when the modal closes and resets YouTube on reopening", () => {
  const onClose = vi.fn();
  const modal = (open: boolean) => (
    <HotelModal title="Hotel" isPopUpShown={open} setIsPopUpShown={onClose}>
      <HotelContent value={[youtube, file]} />
    </HotelModal>
  );
  const view = render(modal(false));
  expect(view.container.querySelector("iframe, video")).toBeNull();
  view.rerender(modal(true));
  fireEvent.click(screen.getByRole("button", { name: /Переглянути відео/ }));
  expect(view.container.querySelectorAll("iframe, video")).toHaveLength(2);
  const video = view.container.querySelector("video")!;
  view.rerender(modal(false));
  expect(view.container.querySelector("iframe, video")).toBeNull();
  expect(video.pause).toHaveBeenCalledTimes(1);
  expect(video.load).toHaveBeenCalledTimes(1);
  expect(video.hasAttribute("src")).toBe(false);
  view.rerender(modal(true));
  expect(view.container.querySelector("iframe")).toBeNull();
  expect(view.container.querySelector("video")).toBeTruthy();
});

it("includes native video controls in the modal keyboard focus loop", () => {
  const view = render(
    <HotelModal title="Hotel" isPopUpShown setIsPopUpShown={vi.fn()}>
      <HotelContent value={[file]} />
    </HotelModal>,
  );
  const close = screen.getByRole("button", { name: "Закрити інформацію про готель" });
  const video = view.container.querySelector("video")!;
  close.focus();
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(video);
  fireEvent.keyDown(document, { key: "Tab" });
  expect(document.activeElement).toBe(close);
});

it("focuses short-description videos before the full description and restores the trigger on close", () => {
  const scroll = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scroll,
  });
  function Fixture() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Відео</button>
        <HotelModal title="Hotel" isPopUpShown={open} setIsPopUpShown={setOpen}>
          <HotelModalContent
            title="Hotel"
            gallery={["/hotel.jpg"]}
            shortDescriptionVideos={[file]}
            focusVideos
            description={[
              { _type: "block", _key: "text", children: [{ _type: "span", text: "Повний опис" }] },
              youtube,
            ]}
          />
        </HotelModal>
      </>
    );
  }
  const view = render(<Fixture />);
  const trigger = screen.getByRole("button", { name: "Відео" });
  trigger.focus();
  fireEvent.click(trigger);
  const videos = screen.getByLabelText("Відео готелю");
  expect(scroll).toHaveBeenCalledWith({ block: "start" });
  expect(document.activeElement).toBe(videos);
  expect(videos.nextElementSibling?.textContent).toBe("Повний опис");
  expect(view.container.querySelectorAll("figure")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Закрити інформацію про готель" }));
  expect(view.container.querySelectorAll("figure")).toHaveLength(0);
  expect(document.activeElement).toBe(trigger);
});
