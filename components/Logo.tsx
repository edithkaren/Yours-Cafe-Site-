export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-full bg-espresso font-display text-[17px] font-semibold text-cream"
      >
        C
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">Your Café</span>
    </span>
  );
}
