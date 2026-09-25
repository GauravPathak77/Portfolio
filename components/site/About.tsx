"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProfileData } from "@/lib/types";

export default function About({ profile }: { profile: ProfileData }) {
  const paragraphs = profile.bio.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <section id="about" className="bg-[var(--bg-alt)] px-6 py-24">
      <h2 className="section-heading">About</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-4xl flex-col items-center gap-10 md:flex-row md:items-start"
      >
        {profile.aboutImage && (
          <div className="h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105">
            <Image
              src={profile.aboutImage}
              alt={profile.name}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="text-center md:text-left">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="mb-4 leading-7 text-[var(--text-muted)]">
              {p}
            </p>
          ))}
          <a href="#projects" className="btn-gradient mt-2 inline-block">
            See My Work
          </a>
        </div>
      </motion.div>

      {profile.skills.length > 0 && (
        <div className="mx-auto mt-16 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.skills.map((group, idx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="surface-card p-5"
            >
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-deep dark:text-brand-cyan">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[var(--bg-alt)] px-2.5 py-1 text-xs font-medium text-[var(--text)] ring-1 ring-[var(--border)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
