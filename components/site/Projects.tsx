"use client";

import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FiArrowRight, FiExternalLink, FiGithub, FiMaximize2 } from "react-icons/fi";
import clsx from "@/lib/clsx";
import type { ProjectData, ProjectType } from "@/lib/types";
import ProjectThumbnail from "./ProjectThumbnail";
import Lightbox, { type LightboxImage } from "./Lightbox";

const typeBadge: Record<ProjectType, string> = {
  "Client Project": "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
  "Live Product": "bg-sky-500/10 text-sky-700 ring-sky-500/30 dark:text-sky-300",
  "AI Product": "bg-fuchsia-500/10 text-fuchsia-700 ring-fuchsia-500/30 dark:text-fuchsia-300",
  "Personal Project": "bg-brand-purple/10 text-brand-deep ring-brand-purple/30 dark:text-violet-300",
};

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

function TypeBadge({ type }: { type: ProjectType }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        typeBadge[type] ?? typeBadge["Personal Project"]
      )}
    >
      {type}
    </span>
  );
}

function ProjectLinks({ project }: { project: ProjectData }) {
  if (!project.liveUrl && !project.githubUrl) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-4">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline dark:text-brand-cyan"
        >
          <FiExternalLink /> Live site
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-deep hover:underline dark:text-brand-cyan"
        >
          <FiGithub /> GitHub
        </a>
      )}
    </div>
  );
}

function TechBadges({ tech, limit }: { tech: string[]; limit?: number }) {
  const shown = limit ? tech.slice(0, limit) : tech;
  if (shown.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <span
          key={item}
          className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-xs font-medium text-brand-deep dark:bg-brand-cyan/10 dark:text-brand-cyan"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ArchitectureFlow({ steps }: { steps: string[] }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        How it works
      </p>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
        {steps.map((step, idx) => (
          <li key={step} className="flex items-center gap-1">
            <span className="rounded-md bg-[var(--bg-alt)] px-2 py-0.5 text-[11px] font-medium text-[var(--text)] ring-1 ring-[var(--border)]">
              {step}
            </span>
            {idx < steps.length - 1 && <FiArrowRight size={11} className="text-[var(--text-muted)]" />}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Thumbnail({
  project,
  large,
  onPreview,
}: {
  project: ProjectData;
  large?: boolean;
  onPreview: (image: LightboxImage) => void;
}) {
  if (!project.image) return <ProjectThumbnail project={project} large={large} />;
  return (
    <button
      type="button"
      onClick={() =>
        onPreview({ src: project.image, alt: `${project.title} screenshot`, caption: project.title })
      }
      aria-label={`View ${project.title} screenshot full size`}
      className="group relative block h-full w-full cursor-zoom-in"
    >
      <ProjectThumbnail project={project} large={large} />
      <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <FiMaximize2 size={12} /> View
      </span>
    </button>
  );
}

function ProjectDetails({ project, featured = false }: { project: ProjectData; featured?: boolean }) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={project.projectType} />
        {featured && (
          <span className="rounded-full bg-gradient-brand px-2.5 py-0.5 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>
      <h3
        className={clsx(
          "mt-3 font-semibold text-brand-deep dark:text-brand-cyan",
          featured ? "text-2xl" : "text-xl"
        )}
      >
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {project.tagline || project.description}
      </p>
      {project.role && (
        <p className="mt-3 text-sm leading-6">
          <span className="font-semibold text-[var(--text)]">My role: </span>
          <span className="text-[var(--text-muted)]">{project.role}</span>
        </p>
      )}
      {project.highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {project.highlights.map((point) => (
            <li key={point} className="flex gap-2.5 text-sm leading-6 text-[var(--text-muted)]">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />
              {point}
            </li>
          ))}
        </ul>
      )}
      {project.image && project.architecture.length > 0 && <ArchitectureFlow steps={project.architecture} />}
      <div className="mt-auto">
        <TechBadges tech={project.techStack} />
        <ProjectLinks project={project} />
      </div>
    </div>
  );
}

function EarlierProjectCard({
  project,
  onPreview,
}: {
  project: ProjectData;
  onPreview: (image: LightboxImage) => void;
}) {
  return (
    <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.1} className="h-full">
      <div className="surface-card flex h-full flex-col overflow-hidden">
        <div className="relative h-32 w-full">
          <Thumbnail project={project} onPreview={onPreview} />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h4 className="font-semibold text-brand-deep dark:text-brand-cyan">{project.title}</h4>
          <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[var(--text-muted)]">
            {project.tagline || project.description}
          </p>
          <div className="mt-auto">
            <TechBadges tech={project.techStack} limit={4} />
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </Tilt>
  );
}

export default function Projects({ projects }: { projects: ProjectData[] }) {
  const [preview, setPreview] = useState<LightboxImage | null>(null);

  if (projects.length === 0) return null;

  const hasFeatured = projects.some((p) => p.featured);
  const main = hasFeatured ? projects.filter((p) => p.featured) : projects;
  const earlier = hasFeatured ? projects.filter((p) => !p.featured) : [];
  const [lead, ...others] = main;

  return (
    <section id="projects" className="bg-[var(--bg)] px-4 py-24">
      <h2 className="section-heading">Projects</h2>
      <p className="mx-auto -mt-8 mb-14 max-w-2xl text-center text-[var(--text-muted)]">
        Client products, real-world systems and AI features — from edge devices and data pipelines
        to web and mobile apps.
      </p>

      <div className="mx-auto max-w-6xl">
        <motion.article
          {...reveal}
          transition={{ duration: 0.5 }}
          className="surface-card flex flex-col overflow-hidden ring-1 ring-brand-purple/20 lg:flex-row"
        >
          <div className="relative h-60 w-full shrink-0 lg:h-auto lg:min-h-[420px] lg:w-[42%]">
            <Thumbnail project={lead} large onPreview={setPreview} />
          </div>
          <ProjectDetails project={lead} featured={hasFeatured} />
        </motion.article>

        {others.length > 0 && (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {others.map((project, idx) => (
              <motion.div key={project._id} {...reveal} transition={{ duration: 0.4, delay: (idx % 2) * 0.08 }}>
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.08} className="h-full">
                  <article className="surface-card flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden">
                      <Thumbnail project={project} onPreview={setPreview} />
                    </div>
                    <ProjectDetails project={project} />
                  </article>
                </Tilt>
              </motion.div>
            ))}
          </div>
        )}

        {earlier.length > 0 && (
          <div className="mt-20">
            <h3 className="text-center text-lg font-semibold text-[var(--text)]">Earlier Projects</h3>
            <p className="mb-8 mt-1 text-center text-sm text-[var(--text-muted)]">
              Where I started — projects from my first years of building for the web and mobile.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {earlier.map((project, idx) => (
                <motion.div key={project._id} {...reveal} transition={{ duration: 0.4, delay: (idx % 4) * 0.06 }}>
                  <EarlierProjectCard project={project} onPreview={setPreview} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Lightbox image={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
