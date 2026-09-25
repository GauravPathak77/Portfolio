"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronsDown } from "react-icons/fi";
import clsx from "@/lib/clsx";
import type { TimelineItemData } from "@/lib/types";

export default function Timeline({ items }: { items: TimelineItemData[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [atEnd, setAtEnd] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      setScrollable(el.scrollHeight > el.clientHeight + 1);
      setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section id="timeline" className="bg-[var(--bg-alt)] px-4 py-24">
      <h2 className="section-heading">My Journey</h2>
      <p className="mx-auto -mt-8 mb-10 max-w-2xl text-center text-[var(--text-muted)]">
        Most recent first — from client work and research back to where I started.
      </p>

      <div className="relative mx-auto max-w-6xl">
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label="Journey timeline"
          className="max-h-[70vh] overflow-y-auto rounded-2xl px-2 pt-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 md:max-h-[1520px]"
        >
          <div className="relative mx-auto w-full max-w-4xl pl-6 md:w-[85%] md:pl-0">
            <div className="timeline-line absolute left-1/2 hidden h-full -translate-x-1/2 md:block" />
            <div className="timeline-line absolute left-0 h-full md:hidden" />

            <ul className="list-none pb-4">
              {items.map((item, idx) => {
                const isOpen = !!expanded[item._id];
                const left = idx % 2 === 0;

                return (
                  <motion.li
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2, root: scrollRef }}
                    transition={{ duration: 0.4 }}
                    className={clsx(
                      "surface-card relative z-10 mb-16 w-full p-5 md:w-[45%]",
                      left ? "md:mr-auto" : "md:ml-auto"
                    )}
                  >
                    <span
                      className={clsx(
                        "absolute -top-9 flex h-9 min-w-36 items-center justify-center whitespace-nowrap rounded-full bg-gradient-brand px-4 text-sm text-white",
                        left ? "left-4 md:left-auto md:right-4" : "left-4"
                      )}
                    >
                      {item.date}
                    </span>
                    <span
                      className={clsx(
                        "absolute top-0 hidden h-7 w-7 -translate-y-1/2 rounded-full bg-brand-purple/40 md:block",
                        left ? "-right-[46px]" : "-left-[46px]"
                      )}
                    />
                    <h3 className="text-lg font-semibold text-brand-deep dark:text-brand-cyan">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {item.shortDescription}
                    </p>

                    {item.fullDescription && (
                      <>
                        <div className={clsx("read-more-content", isOpen && "expanded")}>
                          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                            {item.fullDescription}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setExpanded((prev) => ({ ...prev, [item._id]: !prev[item._id] }))
                          }
                          aria-expanded={isOpen}
                          className="mt-2 text-sm font-medium text-brand-purple hover:underline dark:text-brand-cyan"
                        >
                          {isOpen ? "Read Less" : "Read More"}
                        </button>
                      </>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>

        {scrollable && (
          <div
            className={clsx(
              "pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-2xl bg-gradient-to-b from-transparent to-[var(--bg-alt)] transition-opacity duration-300",
              atEnd && "opacity-0"
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {scrollable && (
        <p
          className={clsx(
            "mt-4 flex items-center justify-center gap-1.5 text-sm text-[var(--text-muted)] transition-opacity duration-300",
            atEnd && "opacity-0"
          )}
          aria-hidden="true"
        >
          <FiChevronsDown className="animate-bounce" /> Scroll for more
        </p>
      )}
    </section>
  );
}
