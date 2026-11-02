"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { CloseModalIcon } from "@/shared/ui";

interface ModalProps {
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: ReactNode;
}

export default function HotelModal({ isPopUpShown, setIsPopUpShown, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!isPopUpShown) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalRef.current?.focus();
  }, [isPopUpShown]);

  useEffect(() => {
    if (!isPopUpShown) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsPopUpShown(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === modalRef.current ||
          !modalRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !modalRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isPopUpShown, setIsPopUpShown]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-10 ${isPopUpShown ? "no-doc-scroll" : "pointer-events-none"}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-black/35 transition duration-[1000ms] ease-in-out ${isPopUpShown ? "opacity-100" : "opacity-0"}`}
        onMouseDown={() => setIsPopUpShown(false)}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isPopUpShown}
        aria-label={`Інформація про готель ${title}`}
        inert={!isPopUpShown}
        className={`relative flex w-full max-w-[1045px] max-h-[calc(100dvh-32px)] flex-col overflow-hidden rounded-2xl bg-white outline-none transition duration-[600ms] ease-out lg:h-[min(676px,calc(100dvh-80px))] ${isPopUpShown ? "translate-y-0 scale-100 opacity-100" : "translate-y-[calc(50dvh-50%)] scale-90 opacity-0"}`}
      >
        <div className="relative z-20 flex h-12 shrink-0 items-center justify-end bg-white px-3 lg:absolute lg:top-4 lg:right-4 lg:h-auto lg:p-0">
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Закрити інформацію про готель"
            onClick={() => setIsPopUpShown(false)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-md text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
          >
            <CloseModalIcon aria-hidden="true" className="size-[18px]" />
          </button>
        </div>
        <div className="min-h-0 w-full lg:h-full">{isPopUpShown ? children : null}</div>
      </div>
    </div>
  );
}
