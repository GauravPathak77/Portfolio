"use client";

import { useState } from "react";
import { useCrud } from "@/hooks/useCrud";
import {
  PROJECT_ICONS,
  PROJECT_TYPES,
  type ProjectData,
  type ProjectIcon,
  type ProjectType,
} from "@/lib/types";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";
import { Input, Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emptyForm = {
  title: "",
  projectType: "Personal Project" as ProjectType,
  tagline: "",
  description: "",
  role: "",
  highlights: "",
  architecture: "",
  icon: "code" as ProjectIcon,
  image: "",
  techStack: "",
  liveUrl: "",
  githubUrl: "",
  featured: true,
};

const toLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const toList = (text: string) =>
  text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function ProjectsAdminPage() {
  const { items, loading, create, update, remove, reorder } = useCrud<ProjectData>("/api/projects");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectData | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: ProjectData) {
    setEditing(item);
    setForm({
      title: item.title,
      projectType: item.projectType ?? "Personal Project",
      tagline: item.tagline ?? "",
      description: item.description ?? "",
      role: item.role ?? "",
      highlights: (item.highlights ?? []).join("\n"),
      architecture: (item.architecture ?? []).join("\n"),
      icon: item.icon ?? "code",
      image: item.image ?? "",
      techStack: (item.techStack ?? []).join(", "),
      liveUrl: item.liveUrl ?? "",
      githubUrl: item.githubUrl ?? "",
      featured: !!item.featured,
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    const payload = {
      ...form,
      highlights: toLines(form.highlights),
      architecture: toLines(form.architecture),
      techStack: toList(form.techStack),
    };
    if (editing) {
      await update(editing._id, payload);
    } else {
      await create({ ...payload, order: items.length });
    }
    setModalOpen(false);
  }

  const columns: Column<ProjectData>[] = [
    { key: "title", label: "Title" },
    { key: "projectType", label: "Type" },
    {
      key: "featured",
      label: "Section",
      render: (item) => (item.featured ? "Main" : "Earlier projects"),
    },
    {
      key: "techStack",
      label: "Tech Stack",
      render: (item) => item.techStack?.join(", "),
    },
  ];

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={openCreate}>Add Project</Button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Project" : "Add Project"}>
        <div className="flex flex-col gap-4">
          <Input label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Project type"
              value={form.projectType}
              options={PROJECT_TYPES}
              onChange={(e) => set("projectType", e.target.value as ProjectType)}
            />
            <Select
              label="Thumbnail icon"
              value={form.icon}
              options={PROJECT_ICONS}
              onChange={(e) => set("icon", e.target.value as ProjectIcon)}
            />
          </div>
          <Textarea
            label="One-line description (shown on the card)"
            rows={2}
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
          <Input label="My role" value={form.role} onChange={(e) => set("role", e.target.value)} />
          <Textarea
            label="Key points (one per line, 3–5)"
            rows={5}
            value={form.highlights}
            onChange={(e) => set("highlights", e.target.value)}
          />
          <Textarea
            label="Architecture steps for the thumbnail (one per line)"
            rows={4}
            value={form.architecture}
            onChange={(e) => set("architecture", e.target.value)}
          />
          <Textarea
            label="Detailed description"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <CloudinaryUploader
            label="Screenshot (optional — replaces the generated thumbnail)"
            value={form.image}
            onChange={(url) => set("image", url)}
          />
          <Input
            label="Tech stack (comma separated)"
            value={form.techStack}
            onChange={(e) => set("techStack", e.target.value)}
          />
          <Input label="Live URL" value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} />
          <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Show in the main projects list (unchecked = &quot;Earlier Projects&quot;)
          </label>
          <Button onClick={handleSubmit}>{editing ? "Save Changes" : "Create Project"}</Button>
        </div>
      </Modal>
    </div>
  );
}
