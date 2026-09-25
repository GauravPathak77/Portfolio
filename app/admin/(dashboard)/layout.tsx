import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import ThemeToggleAdmin from "@/components/admin/ThemeToggleAdmin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-alt)]">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-end border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3">
          <ThemeToggleAdmin />
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
