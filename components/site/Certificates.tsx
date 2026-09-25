"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiExternalLink, FiMaximize2 } from "react-icons/fi";
import type { CertificateData } from "@/lib/types";
import Carousel from "./Carousel";
import Lightbox, { type LightboxImage } from "./Lightbox";

export default function Certificates({ certificates }: { certificates: CertificateData[] }) {
  const [preview, setPreview] = useState<LightboxImage | null>(null);

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="bg-[var(--bg-alt)] px-4 py-24">
      <h2 className="section-heading">Certificates</h2>
      <p className="mx-auto -mt-8 mb-10 max-w-2xl text-center text-[var(--text-muted)]">
        Courses and certifications I&apos;ve completed. Tap a certificate to view it full size.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl"
      >
        <Carousel label="Certificates">
          {certificates.map((cert) => (
            <article
              key={cert._id}
              className="surface-card flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              {cert.image ? (
                <button
                  type="button"
                  onClick={() =>
                    setPreview({
                      src: cert.image,
                      alt: cert.title,
                      caption: [cert.title, cert.issuer, cert.issueDate].filter(Boolean).join(" · "),
                    })
                  }
                  aria-label={`View ${cert.title} certificate full size`}
                  className="group relative aspect-[4/3] w-full cursor-zoom-in bg-[var(--bg)]"
                >
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                    className="object-contain p-3"
                  />
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <FiMaximize2 size={14} />
                  </span>
                </button>
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--bg)] text-brand-purple dark:text-brand-cyan">
                  <FiAward size={44} />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold leading-snug text-brand-deep dark:text-brand-cyan">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {[cert.issuer, cert.issueDate].filter(Boolean).join(" · ")}
                </p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-deep hover:underline dark:text-brand-cyan"
                  >
                    <FiExternalLink />{" "}
                    {cert.credentialUrl.includes("drive.google.com") ? "View original" : "Verify credential"}
                  </a>
                )}
              </div>
            </article>
          ))}
        </Carousel>
      </motion.div>

      <Lightbox image={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
