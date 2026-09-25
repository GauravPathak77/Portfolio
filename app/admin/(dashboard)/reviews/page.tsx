"use client";

import { useState } from "react";
import { useCrud } from "@/hooks/useCrud";
import type { ProjectData, ReviewData } from "@/lib/types";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emptyForm = {
  clientName: "",
  clientRole: "",
  company: "",
  location: "",
  project: "",
  message: "",
  rating: 5,
  avatar: "",
  published: false,
};

export default function ReviewsAdminPage() {
  const { items, loading, create, update, remove, reorder } = useCrud<ReviewData>("/api/reviews");
  const { items: projects } = useCrud<ProjectData>("/api/projects");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ReviewData | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: ReviewData) {
    setEditing(item);
    setForm({
      clientName: item.clientName,
      clientRole: item.clientRole ?? "",
      company: item.company ?? "",
      location: item.location ?? "",
      project: item.project ?? "",
      message: item.message,
      rating: item.rating,
      avatar: item.avatar ?? "",
      published: item.published !== false,
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (editing) {
      await update(editing._id, form);
    } else {
      await create({ ...form, order: items.length });
    }
    setModalOpen(false);
  }

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<ReviewData>[] = [
    {
      key: "published",
      label: "Status",
      render: (item) =>
        item.published === false ? (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Draft — awaiting approval
          </span>
        ) : (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Published
          </span>
        ),
    },
    { key: "clientName", label: "Client" },
    { key: "project", label: "Project" },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating", render: (item) => "★".repeat(item.rating) },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <Button onClick={openCreate}>Add Review</Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <AdminTable
          items={items}
          columns={columns}
          onEdit={openEdit}
          onDelete={(item) => {
            if (confirm(`Delete review from "${item.clientName}"?`)) remove(item._id);
          }}
          onMoveUp={(item) => reorder(item._id, "up")}
          onMoveDown={(item) => reorder(item._id, "down")}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Review" : "Add Review"}>
        <div className="flex flex-col gap-4">
          <Input label="Client name" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Client role" value={form.clientRole} onChange={(e) => set("clientRole", e.target.value)} />
            <Input label="Company" value={form.company} onChange={(e) => set("company", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Project"
              list="review-project-options"
              placeholder="Pick or type a project"
              value={form.project}
              onChange={(e) => set("project", e.target.value)}
            />
            <Input
              label="Location"
              placeholder="e.g. Toronto, Canada"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <datalist id="review-project-options">
            {projects.map((project) => (
              <option key={project._id} value={project.title} />
            ))}
          </datalist>
          <Textarea
            label="Review"
            rows={5}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
          <Input
            label="Rating (1-5)"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => set("rating", Math.min(5, Math.max(1, Number(e.target.value) || 1)))}
          />
          <CloudinaryUploader
            label="Client photo (optional — initials are shown otherwise)"
            value={form.avatar}
            onChange={(url) => set("avatar", url)}
          />
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            <span>
              Published — only tick this once the client has approved this testimonial and agreed to
              their name being shown.
            </span>
          </label>
          <Button onClick={handleSubmit}>{editing ? "Save Changes" : "Create Review"}</Button>
        </div>
      </Modal>
    </div>
  );
}
