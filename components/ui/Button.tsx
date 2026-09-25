"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "@/lib/clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-gradient-brand text-white hover:scale-[1.03] shadow-md",
  secondary:
    "bg-[var(--bg-alt)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--border)]",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--bg-alt)]",
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
