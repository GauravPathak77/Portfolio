import Link from "next/link";
import { getDbProvider, getRepo } from "@/lib/repo";

async function getCounts() {
  try {
    const repo = await getRepo();
    const [projects, certificates, timeline, reviews, messages] = await Promise.all([
      repo.list("projects"),
      repo.list("certificates"),
      repo.list("timeline"),
      repo.list("reviews"),
      repo.list("messages"),
    ]);
    return {
      ok: true,
      projects: projects.length,
      certificates: certificates.length,
      timeline: timeline.length,
      reviews: reviews.length,
      unreadMessages: messages.filter((m) => !m.read).length,
      totalMessages: messages.length,
    };
  } catch (err) {
    console.error("Failed to load dashboard counts:", err);
    return {
      ok: false,
      projects: 0,
      certificates: 0,
      timeline: 0,
      reviews: 0,
      unreadMessages: 0,
      totalMessages: 0,
    };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();
  const provider = getDbProvider();

  const cards = [
    { label: "Projects", value: counts.projects, href: "/admin/projects" },
    { label: "Certificates", value: counts.certificates, href: "/admin/certificates" },
    { label: "Timeline Entries", value: counts.timeline, href: "/admin/timeline" },
    { label: "Reviews", value: counts.reviews, href: "/admin/reviews" },
    {
      label: "Messages",
      value: `${counts.unreadMessages} unread / ${counts.totalMessages}`,
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)] ring-1 ring-[var(--border)]">
          Database: {provider === "mongodb" ? "MongoDB Atlas" : "SQLite (local)"}
        </span>
      </div>
      {!counts.ok && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-500/10 p-4 text-sm text-red-500">
          Couldn&apos;t reach the database. Check <code>DB_PROVIDER</code> and{" "}
          <code>MONGODB_URI</code> in <code>.env.local</code>.
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="surface-card p-6 transition-transform hover:scale-[1.02]">
            <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-deep dark:text-brand-cyan">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
