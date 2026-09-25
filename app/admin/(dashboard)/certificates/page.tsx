"use client";

import { useState } from "react";
import { useCrud } from "@/hooks/useCrud";
import type { CertificateData } from "@/lib/types";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import Modal from "@/components/ui/Modal";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emptyForm = { title: "", issuer: "", issueDate: "", image: "", credentialUrl: "" };

export default function CertificatesAdminPage() {
  const { items, loading, create, update, remove, reorder } =
    useCrud<CertificateData>("/api/certificates");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CertificateData | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: CertificateData) {
    setEditing(item);
    setForm({
      title: item.title,
      issuer: item.issuer,
      issueDate: item.issueDate ?? "",
      image: item.image ?? "",
      credentialUrl: item.credentialUrl ?? "",
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

  const columns: Column<CertificateData>[] = [
    { key: "title", label: "Title" },
    { key: "issuer", label: "Issuer" },
    { key: "issueDate", label: "Date" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <Button onClick={openCreate}>Add Certificate</Button>
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
        title={editing ? "Edit Certificate" : "Add Certificate"}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Issuer"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
          />
          <Input
            label="Issue Date"
            placeholder="e.g. March 2025"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
          />
          <CloudinaryUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <Input
            label="Credential URL"
            value={form.credentialUrl}
            onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
          />
          <Button onClick={handleSubmit}>{editing ? "Save Changes" : "Create Certificate"}</Button>
        </div>
      </Modal>
    </div>
  );
}
