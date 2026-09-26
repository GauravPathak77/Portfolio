"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { useTypewriter } from "@/hooks/useTypewriter";
import { faceThumbnail } from "@/lib/cloudinary";
import type { ProfileData } from "@/lib/types";

export interface HeroStat {
  value: string;
  label: string;
}

export default function Hero({ profile, stats }: { profile: ProfileData; stats: HeroStat[] }) {
  const typed = useTypewriter(profile.name ? `I AM ${profile.name.toUpperCase()}` : "", 90, 1200);

  return (
    <section id="home" className="relative w-full overflow-hidden bg-gradient-brand">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#56d8e4] opacity-50 blur-3xl motion-safe:animate-blob" />
        <div className="absolute -right-24 top-10 h-[32rem] w-[32rem] rounded-full bg-[#f0027f] opacity-30 blur-3xl motion-safe:animate-blob-slow" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#6a06ec] opacity-40 blur-3xl motion-safe:animate-blob" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>
      {/* Deepens the brand gradient slightly so white text stays readable over the cyan end. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/25" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-12 md:pb-40 md:pt-20">
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            {profile.heroImage && (
              <Image
                src={faceThumbnail(profile.heroImage, 256)}
                alt={profile.name}
                width={96}
                height={96}
                className="mx-auto mb-5 h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-white/40 md:hidden"
                priority
              />
            )}

            <p className="mb-3 min-h-[28px] text-base font-semibold tracking-wide text-white/90 md:text-lg">
              {typed}
              <span className="animate-pulse">|</span>
            </p>

            {profile.headline && (
              <h1 className="text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
                {profile.headline}
              </h1>
            )}

            {profile.tagline && (
              <p className="mt-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur">
                {profile.tagline}
              </p>
            )}

            {profile.summary && (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:mx-0 md:text-lg">
                {profile.summary}
              </p>
            )}

            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href="#projects"
                className="rounded-full bg-white px-6 py-3 font-medium text-brand-deep shadow-lg transition-transform hover:scale-105"
              >
                View Projects
              </a>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/70 px-6 py-3 font-medium text-white transition-colors hover:bg-white/15"
                >
                  Resume
                </a>
              )}
              <a
                href="#contact"
                className="rounded-full border border-white/70 px-6 py-3 font-medium text-white transition-colors hover:bg-white/15"
              >
                Let&apos;s Talk
              </a>
            </div>

            {stats.length > 0 && (
              <dl className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse text-center md:text-left">
                    <dt className="text-xs font-medium uppercase tracking-wider text-white/75">{stat.label}</dt>
                    <dd className="text-2xl font-bold text-white drop-shadow-sm">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </motion.div>

          {profile.heroImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden shrink-0 md:block"
            >
              <div className="h-72 w-72 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/25 lg:h-80 lg:w-80">
                <Image
                  src={profile.heroImage}
                  alt={profile.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}
        </div>

        {profile.highlights.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {profile.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur"
              >
                <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      <svg
        className="absolute bottom-0 left-0 h-24 w-full md:h-32"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,64 C240,128 480,0 720,48 C960,96 1200,112 1440,40 L1440,120 L0,120 Z"
          fill="var(--bg-alt)"
        />
      </svg>
    </section>
  );
}
