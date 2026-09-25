import { FaFacebookF, FaGithub, FaLinkedinIn, FaTwitter, FaWhatsapp } from "react-icons/fa";
import type { ProfileData } from "@/lib/types";
import type { NavLink } from "./Navbar";

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  facebook: FaFacebookF,
  whatsapp: FaWhatsapp,
} as const;

export default function Footer({ profile, links }: { profile: ProfileData; links: NavLink[] }) {
  const socialEntries = Object.entries(profile.socialLinks || {}).filter(([, url]) => url);

  return (
    <footer className="relative overflow-hidden rounded-tl-[80px] bg-gradient-brand px-8 pb-8 pt-16 text-white">
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-wrap justify-between gap-10">
        <div className="max-w-sm">
          <h3 className="mb-3 text-lg font-semibold">{profile.name}</h3>
          {profile.headline && <p className="text-sm font-medium leading-6">{profile.headline}</p>}
          {profile.tagline && <p className="mt-1 text-sm leading-6 text-white/85">{profile.tagline}</p>}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Links</h3>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {profile.email && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <a href={`mailto:${profile.email}`} className="text-sm hover:underline">
              {profile.email}
            </a>
          </div>
        )}

        {socialEntries.length > 0 && (
          <div className="flex h-fit gap-3">
            {socialEntries.map(([key, url]) => {
              const Icon = iconMap[key as keyof typeof iconMap];
              if (!Icon || !url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-deep transition-transform hover:scale-110"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        )}
      </div>

      <hr className="relative my-8 border-white/25" />
      <p className="relative text-center text-xs text-white/80">
        Copyright © {new Date().getFullYear()} {profile.name} — All Rights Reserved
      </p>
    </footer>
  );
}
