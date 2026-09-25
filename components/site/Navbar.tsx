"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export interface NavLink {
  href: string;
  label: string;
}

export default function Navbar({ name, links }: { name: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-gradient-brand px-6 py-4 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#home" className="text-lg font-semibold text-white">
          {name || "Portfolio"}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white"
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
              className="rounded-md px-3 py-3 text-center text-sm font-medium text-white hover:bg-white/15"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
