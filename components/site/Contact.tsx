"use client";

import { useState, type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="flex justify-center bg-[var(--bg)] px-4 py-24">
      <div className="surface-card w-full max-w-2xl p-8 md:p-10">
        <h2 className="gradient-text text-center text-3xl font-semibold">Get In Touch</h2>
        <p className="mb-8 mt-2 text-center text-sm text-[var(--text-muted)]">
          Open to freelance projects and full-stack / SDE roles. Tell me what you&apos;re building.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <Input
            label="Subject"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <Textarea
            label="Message"
            rows={5}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <Button type="submit" disabled={status === "sending"} className="self-center px-10">
            {status === "sending" ? "Sending..." : "Submit"}
          </Button>
          {status === "sent" && (
            <p className="text-center text-sm text-green-500">
              Thanks for reaching out — I&apos;ll get back to you soon!
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
