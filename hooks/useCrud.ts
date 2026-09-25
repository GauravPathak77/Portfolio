"use client";

import { useCallback, useEffect, useState } from "react";

export function useCrud<T extends { _id: string }>(apiPath: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiPath, { cache: "no-store" });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [apiPath]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(payload: Partial<T>) {
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create");
    await refresh();
  }

  async function update(id: string, payload: Partial<T>) {
    const res = await fetch(`${apiPath}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update");
    await refresh();
  }

  async function remove(id: string) {
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    await refresh();
  }

  async function reorder(id: string, direction: "up" | "down") {
    const sorted = [...items].sort((a, b) => (a as unknown as { order: number }).order - (b as unknown as { order: number }).order);
    const idx = sorted.findIndex((i) => i._id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const current = sorted[idx] as unknown as { order: number; _id: string };
    const swap = sorted[swapIdx] as unknown as { order: number; _id: string };
    const currentOrder = current.order ?? idx;
    const swapOrder = swap.order ?? swapIdx;

    await Promise.all([
      fetch(`${apiPath}/${current._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: swapOrder }),
      }),
      fetch(`${apiPath}/${swap._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: currentOrder }),
      }),
    ]);
    await refresh();
  }

  return { items, loading, refresh, create, update, remove, reorder };
}
