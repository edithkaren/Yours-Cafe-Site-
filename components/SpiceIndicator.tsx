import type { SpiceLevel } from "@/lib/types";

export function SpiceIndicator({ level }: { level: SpiceLevel }) {
  if (level === 0) return null;
  const labels = ["", "Mild", "Medium", "Hot"];
  return (
    <span className="inline-flex items-center gap-1 text-xs text-terracotta" aria-label={`Spice level: ${labels[level]}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${i < level ? "bg-terracotta" : "bg-terracotta/20"}`}
        />
      ))}
      <span className="ml-1">{labels[level]}</span>
    </span>
  );
}
