"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "@/lib/clsx";

interface CarouselState {
  fits: boolean;
  canPrev: boolean;
  canNext: boolean;
  pages: number;
  page: number;
}

export default function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const [state, setState] = useState<CarouselState>({
    fits: true,
    canPrev: false,
    canNext: false,
    pages: 1,
    page: 0,
  });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const fits = max <= 1;
    const pages = fits ? 1 : Math.ceil(el.scrollWidth / el.clientWidth - 0.05);
    setState({
      fits,
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft < max - 4,
      pages,
      page: fits ? 0 : Math.round((el.scrollLeft / max) * (pages - 1)),
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure, items.length]);

  function scrollPage(direction: 1 | -1) {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  function goToPage(page: number) {
    const el = trackRef.current;
    if (!el || state.pages < 2) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (max * page) / (state.pages - 1), behavior: "smooth" });
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={trackRef}
        tabIndex={state.fits ? -1 : 0}
        className={clsx(
          "no-scrollbar flex snap-x snap-mandatory scroll-px-1 gap-6 overflow-x-auto scroll-smooth rounded-2xl px-1 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40",
          state.fits && "justify-center"
        )}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${items.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            {item}
          </div>
        ))}
      </div>

      {!state.fits && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollPage(-1)}
            disabled={!state.canPrev}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text)] shadow ring-1 ring-[var(--border)] transition-colors hover:text-brand-purple disabled:opacity-40 dark:hover:text-brand-cyan"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: state.pages }).map((_, page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-label={`Go to page ${page + 1}`}
                aria-current={page === state.page}
                className={clsx(
                  "h-2 rounded-full transition-all",
                  page === state.page ? "w-6 bg-gradient-brand" : "w-2 bg-[var(--border)] hover:bg-brand-purple/40"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollPage(1)}
            disabled={!state.canNext}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text)] shadow ring-1 ring-[var(--border)] transition-colors hover:text-brand-purple disabled:opacity-40 dark:hover:text-brand-cyan"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
