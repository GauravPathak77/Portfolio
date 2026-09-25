"use client";

import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import clsx from "@/lib/clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string };
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: readonly string[];
};

const baseClasses =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/30";

function Field({ label, id, children }: { label?: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-muted)]">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export function Input({ label, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field label={label} id={fieldId}>
      <input id={fieldId} className={clsx(baseClasses, className)} {...props} />
    </Field>
  );
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field label={label} id={fieldId}>
      <textarea id={fieldId} className={clsx(baseClasses, "resize-none", className)} {...props} />
    </Field>
  );
}

export function Select({ label, className, id, options, ...props }: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <Field label={label} id={fieldId}>
      <select id={fieldId} className={clsx(baseClasses, className)} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}
