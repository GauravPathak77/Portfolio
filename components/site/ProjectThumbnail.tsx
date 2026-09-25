import Image from "next/image";
import type { IconType } from "react-icons";
import { FaBus, FaCarSide } from "react-icons/fa";
import { GiHorseHead } from "react-icons/gi";
import { FiArrowDown, FiArrowRight, FiCode, FiMic, FiShoppingCart } from "react-icons/fi";
import clsx from "@/lib/clsx";
import type { ProjectData, ProjectIcon, ProjectType } from "@/lib/types";

const icons: Record<ProjectIcon, IconType> = {
  code: FiCode,
  bus: FaBus,
  horse: GiHorseHead,
  car: FaCarSide,
  mic: FiMic,
  cart: FiShoppingCart,
};

const glows: Record<ProjectType, [string, string]> = {
  "Client Project": ["from-[#56d8e4] to-[#9f01ea]", "from-[#9f01ea] to-[#56d8e4]"],
  "AI Product": ["from-[#9f01ea] to-[#f0027f]", "from-[#f0027f] to-[#6a06ec]"],
  "Live Product": ["from-[#10b981] to-[#56d8e4]", "from-[#56d8e4] to-[#6a06ec]"],
  "Personal Project": ["from-[#3b82f6] to-[#56d8e4]", "from-[#6a06ec] to-[#3b82f6]"],
};

export default function ProjectThumbnail({
  project,
  large = false,
}: {
  project: ProjectData;
  large?: boolean;
}) {
  if (project.image) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes={large ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover"
        />
      </div>
    );
  }

  const Icon = icons[project.icon] ?? FiCode;
  const [primaryGlow, secondaryGlow] = glows[project.projectType] ?? glows["Personal Project"];
  const steps = project.architecture;

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-[#0d0b1f] p-5 text-white"
      role="img"
      aria-label={`${project.title} architecture illustration`}
    >
      <div
        className={clsx("absolute -right-16 -top-20 h-60 w-60 rounded-full bg-gradient-to-br opacity-60 blur-3xl", primaryGlow)}
      />
      <div
        className={clsx("absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-gradient-to-br opacity-35 blur-3xl", secondaryGlow)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />

      {steps.length > 0 ? (
        <>
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Icon size={20} />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              How it works
            </span>
          </div>
          {large && (
            <ol className="relative my-auto hidden flex-col items-center gap-1 pt-6 lg:flex">
              {steps.map((step, idx) => (
                <li key={step} className="flex w-full max-w-[260px] flex-col items-center gap-1">
                  <span className="w-full rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur">
                    {step}
                  </span>
                  {idx < steps.length - 1 && <FiArrowDown className="text-white/40" size={14} />}
                </li>
              ))}
            </ol>
          )}
          <ol
            className={clsx(
              "relative mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-2 pt-5",
              large && "lg:hidden"
            )}
          >
            {steps.map((step, idx) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur">
                  {step}
                </span>
                {idx < steps.length - 1 && <FiArrowRight className="text-white/40" size={12} />}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Icon size={26} />
          </span>
          <span className="text-sm font-semibold text-white/80">{project.title}</span>
        </div>
      )}
    </div>
  );
}
