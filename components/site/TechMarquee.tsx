import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import { LuBot, LuBrain, LuBrainCircuit, LuMicrochip, LuWorkflow } from "react-icons/lu";
import {
  SiDocker,
  SiExpress,
  SiFastapi,
  SiJavascript,
  SiLangchain,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiNumpy,
  SiOllama,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiRaspberrypi,
  SiReact,
  SiScikitlearn,
  SiTensorflow,
  SiTypescript,
  SiYolo,
} from "react-icons/si";

const stack: { name: string; icon: IconType }[] = [
  // Web & mobile
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: SiReact },
  { name: "React Native", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  // Backend & data
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express.js", icon: SiExpress },
  { name: "Python", icon: SiPython },
  { name: "FastAPI", icon: SiFastapi },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  // AI & ML
  { name: "LLM / VLM", icon: LuBrainCircuit },
  { name: "Agentic AI", icon: LuBot },
  { name: "LangChain", icon: SiLangchain },
  { name: "RAG", icon: LuWorkflow },
  { name: "Ollama", icon: SiOllama },
  { name: "Deep Learning", icon: LuBrain },
  { name: "TensorFlow", icon: SiTensorflow },
  { name: "PyTorch", icon: SiPytorch },
  { name: "scikit-learn", icon: SiScikitlearn },
  { name: "NumPy", icon: SiNumpy },
  { name: "OpenCV", icon: SiOpencv },
  { name: "YOLO", icon: SiYolo },
  // Infrastructure & edge
  { name: "Edge Computing", icon: LuMicrochip },
  { name: "Raspberry Pi", icon: SiRaspberrypi },
  { name: "Docker", icon: SiDocker },
  { name: "Nginx", icon: SiNginx },
  { name: "AWS", icon: FaAws },
];

function Item({ name, icon: Icon }: { name: string; icon: IconType }) {
  return (
    <li className="flex shrink-0 items-center gap-2.5 text-[var(--text-muted)] transition-colors hover:text-brand-deep dark:hover:text-brand-cyan">
      <Icon size={22} aria-hidden="true" />
      <span className="whitespace-nowrap text-sm font-medium">{name}</span>
    </li>
  );
}

export default function TechMarquee() {
  return (
    <section aria-label="Technologies I work with" className="bg-[var(--bg-alt)] pb-4 pt-2">
      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Technologies I work with
      </p>

      {/* Animated strip; the list is duplicated so the loop is seamless. */}
      <div aria-hidden="true" className="group relative hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-safe:block">
        <ul className="flex w-max animate-marquee gap-12 pr-12 group-hover:[animation-play-state:paused]">
          {[...stack, ...stack].map((tech, idx) => (
            <Item key={`${tech.name}-${idx}`} {...tech} />
          ))}
        </ul>
      </div>

      {/* Static fallback for visitors who prefer reduced motion. */}
      <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-4 px-6 motion-safe:sr-only">
        {stack.map((tech) => (
          <Item key={tech.name} {...tech} />
        ))}
      </ul>
    </section>
  );
}
