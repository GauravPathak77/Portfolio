type ClassValue = string | number | null | boolean | undefined;

export default function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
