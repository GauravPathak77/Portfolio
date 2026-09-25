"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiAward,
  FiClock,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMail,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import clsx from "@/lib/clsx";

const links = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/projects", label: "Projects", icon: FiGrid },
  { href: "/admin/certificates", label: "Certificates", icon: FiAward },
  { href: "/admin/timeline", label: "Timeline", icon: FiClock },
  { href: "/admin/reviews", label: "Reviews", icon: FiStar },
  { href: "/admin/messages", label: "Messages", icon: FiMail },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-8 px-2">
        <p className="text-lg font-semibold gradient-text">Admin Panel</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-brand text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-alt)]"
              )}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2 border-t border-[var(--border)] pt-4">
        <Link href="/" target="_blank" className="text-xs text-[var(--text-muted)] hover:underline">
          View live site ↗
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
        >
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
