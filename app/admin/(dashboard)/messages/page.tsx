"use client";

import { useCrud } from "@/hooks/useCrud";
import type { MessageData } from "@/lib/types";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import clsx from "@/lib/clsx";

export default function MessagesAdminPage() {
  const { items, loading, update, remove } = useCrud<MessageData>("/api/messages");

  const columns: Column<MessageData>[] = [
    {
      key: "read",
      label: "Status",
      render: (item) => (
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            item.read
              ? "bg-[var(--bg-alt)] text-[var(--text-muted)]"
              : "bg-brand-purple/10 text-brand-purple dark:bg-brand-cyan/10 dark:text-brand-cyan"
          )}
        >
          {item.read ? "Read" : "Unread"}
        </span>
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    {
      key: "createdAt",
      label: "Received",
      render: (item) => new Date(item.createdAt).toLocaleString(),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Messages</h1>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <AdminTable
          items={items}
          columns={columns}
          onEdit={(item) => update(item._id, { read: !item.read })}
          onDelete={(item) => {
            if (confirm(`Delete message from "${item.name}"?`)) remove(item._id);
          }}
          emptyLabel="No messages yet."
        />
      )}
    </div>
  );
}
