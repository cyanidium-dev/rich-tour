"use client";

import { useEffect, useRef, useState } from "react";
import { isHotelVideoBlock, type HotelVideoBlock } from "@/entities/tour";

export default function HotelVideo({ value }: { value: HotelVideoBlock }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const source = value._type === "hotelVideoFile" ? value.url : undefined;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    // Strict Mode replays effects; restore the source after its cleanup as well.
    if (video.getAttribute("src") !== source) video.setAttribute("src", source);
    setFailed(false);
    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [source]);
  if (!isHotelVideoBlock(value)) return null;
  const title =
    typeof value.title === "string" && value.title.trim() ? value.title : "Відео готелю";

  return (
    <figure className="my-5 min-w-0">
      {value._type === "hotelVideoFile" ? (
        <>
          <video
            ref={videoRef}
            controls
            playsInline
            preload="none"
            tabIndex={0}
            src={value.url}
            poster={value.posterUrl}
            aria-label={title}
            className="block aspect-video max-h-[60dvh] w-full rounded-xl bg-black object-contain"
            onError={() => setFailed(true)}
          />
          {failed && <p role="alert">Не вдалося відтворити відео. Спробуйте пізніше.</p>}
        </>
      ) : (
        <>
          <div className="aspect-video min-h-[200px] w-full overflow-hidden rounded-xl bg-black">
            {started ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${value.videoId}?playsinline=1`}
                title={title}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full min-h-[200px] w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="flex h-full min-h-[200px] w-full cursor-pointer items-center justify-center gap-3 p-5 text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                aria-label={`Переглянути відео: ${title}`}
              >
                <span aria-hidden="true">▶</span> Переглянути відео
              </button>
            )}
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${value.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm underline"
          >
            Відкрити на YouTube
          </a>
        </>
      )}
      {value.title && <figcaption className="mt-2 text-sm">{title}</figcaption>}
    </figure>
  );
}
