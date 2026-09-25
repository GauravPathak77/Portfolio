import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("surface-card", className)}>{children}</div>;
}
