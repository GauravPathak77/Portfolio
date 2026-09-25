"use client";

import type { ReactNode } from "react";
import { FiArrowDown, FiArrowUp, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export default function AdminTable<T extends { _id: string }>({
  items,
  columns,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  emptyLabel = "No items yet.",
}: {
  items: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onMoveUp?: (item: T) => void;
  onMoveDown?: (item: T) => void;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="surface-card p-8 text-center text-sm text-[var(--text-muted)]">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-[var(--border)] text-[var(--text-muted)]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-b border-[var(--border)] last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="max-w-xs truncate px-4 py-3 align-top">
                  {col.render ? col.render(item) : String((item as never)[col.key] ?? "")}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {onMoveUp && (
                    <button
                      onClick={() => onMoveUp(item)}
                      className="rounded p-1.5 hover:bg-[var(--bg-alt)]"
                      aria-label="Move up"
                    >
                      <FiArrowUp size={14} />
                    </button>
                  )}
                  {onMoveDown && (
                    <button
                      onClick={() => onMoveDown(item)}
                      className="rounded p-1.5 hover:bg-[var(--bg-alt)]"
                      aria-label="Move down"
                    >
                      <FiArrowDown size={14} />
                    </button>
                  )}
                  <Button variant="secondary" onClick={() => onEdit(item)} aria-label="Edit" className="!px-3 !py-1.5">
                    <FiEdit2 size={14} />
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(item)} aria-label="Delete" className="!px-3 !py-1.5">
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
