"use client";

import { useState } from "react";
import { useCrud } from "@/hooks/useCrud";
import type { TimelineItemData } from "@/lib/types";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emptyForm = { title: "", shortDescription: "", fullDescription: "", date: "" };

export default function TimelineAdminPage() {
  const { items, loading, create, update, remove, reorder } =
    useCrud<TimelineItemData>("/api/timeline");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TimelineItemData | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: TimelineItemData) {
    setEditing(item);
    setForm({
      title: item.title,
      shortDescription: item.shortDescription,
      fullDescription: item.fullDescription ?? "",
      date: item.date,
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (editing) {
      await update(editing._id, form);
    } else {
      // Timeline is newest-first, so new entries go to the top.
      await create({ ...form, order: items.length ? Math.min(...items.map((i) => i.order ?? 0)) - 1 : 0 });
    }
    setModalOpen(false);
  }

  const columns: Column<TimelineItemData>[] = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "shortDescription", label: "Short Description" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Timeline</h1>
        <Button onClick={openCreate}>Add Entry</Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <AdminTable
          items={items}
          columns={columns}
          onEdit={openEdit}
          onDelete={(item) => {
            if (confirm(`Delete "${item.title}"?`)) remove(item._id);
          }}
          onMoveUp={(item) => reorder(item._id, "up")}
          onMoveDown={(item) => reorder(item._id, "down")}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Timeline Entry" : "Add Timeline Entry"}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Date"
            placeholder="e.g. April 2019"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Textarea
            label="Short Description"
            rows={2}
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          />
          <Textarea
            label="Full Description (Read More content)"
            rows={4}
            value={form.fullDescription}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
          />
          <Button onClick={handleSubmit}>{editing ? "Save Changes" : "Create Entry"}</Button>
        </div>
      </Modal>
    </div>
  );
}
