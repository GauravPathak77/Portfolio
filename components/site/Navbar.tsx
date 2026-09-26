"use client";

import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import clsx from "@/lib/clsx";
import ThemeToggle from "./ThemeToggle";

export interface NavLink {
  href: string;
  label: string;
}

export default function Navbar({ name, links }: { name: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        setScrolled(window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Highlights whichever section is crossing the middle of the viewport.
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    const home = document.getElementById("home");
    const homeObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(null),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    if (home) homeObserver.observe(home);
    return () => {
      observer.disconnect();
      homeObserver.disconnect();
    };
  }, [links]);

  const linkClass = (href: string) =>
    clsx(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active === href ? "bg-white/20 text-white" : "text-white/85 hover:bg-white/15 hover:text-white"
    );

  return (
    <nav
      className={clsx(
        "sticky top-0 z-40 px-6 transition-all duration-300",
        scrolled ? "py-2.5 shadow-lg backdrop-blur-md" : "py-4 shadow-md"
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 -z-10 bg-gradient-brand transition-opacity duration-300",
          scrolled ? "opacity-90" : "opacity-100"
        )}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#home" className="text-lg font-semibold text-white">
          {name || "Portfolio"}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </a>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-white"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-1 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active === link.href ? "location" : undefined}
              className={clsx(linkClass(link.href), "py-3 text-center")}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-white/90"
        aria-hidden="true"
      />
    </nav>
  );
}
