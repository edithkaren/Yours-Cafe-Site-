/**
 * Image-ready placeholder. Replace the inner block with <Image> once photos exist.
 * Keeps the aspect ratio stable so layout never shifts when photos are added.
 */
export function ImagePlaceholder({
  label = "Photo coming soon",
  ratio = "aspect-[4/3]",
  className = "",
}: {
  label?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`${ratio} relative w-full overflow-hidden rounded-2xl bg-beige ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(41,33,29,0.12) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-cream/80 px-3 py-1 text-xs text-muted">
        {label}
      </span>
    </div>
  );
}
