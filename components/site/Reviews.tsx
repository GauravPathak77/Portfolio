"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiBriefcase, FiMapPin, FiStar } from "react-icons/fi";
import { BsQuote } from "react-icons/bs";
import type { ReviewData } from "@/lib/types";
import Carousel from "./Carousel";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Reviews({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-[var(--bg)] px-4 py-24">
      <h2 className="section-heading">Client Reviews</h2>
      <p className="mx-auto -mt-8 mb-10 max-w-2xl text-center text-[var(--text-muted)]">
        What clients say about working with me.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl"
      >
        <Carousel label="Client reviews">
          {reviews.map((review) => (
            <article key={review._id} className="surface-card flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <BsQuote className="text-4xl text-brand-purple/40 dark:text-brand-cyan/40" aria-hidden="true" />
                <div
                  className="flex gap-0.5 text-brand-purple dark:text-brand-cyan"
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={15} className={i < review.rating ? "fill-current" : "opacity-30"} />
                  ))}
                </div>
              </div>

              <blockquote className="mt-3 flex-1 text-sm leading-7 text-[var(--text)]">
                {review.message}
              </blockquote>

              {review.project && (
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-deep dark:bg-brand-cyan/10 dark:text-brand-cyan">
                  <FiBriefcase size={12} /> {review.project}
                </span>
              )}

              <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-brand text-sm font-semibold text-white">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.clientName}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(review.clientName)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)]">{review.clientName}</p>
                  {(review.clientRole || review.company) && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {[review.clientRole, review.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {review.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <FiMapPin size={11} /> {review.location}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </Carousel>
      </motion.div>
    </section>
  );
}
