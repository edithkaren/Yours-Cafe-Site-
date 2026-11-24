import type { MenuItem } from "@/lib/types";
import { VegBadge } from "@/components/VegBadge";
import { SpiceIndicator } from "@/components/SpiceIndicator";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article
      className={`group flex gap-4 rounded-2xl border border-espresso/10 bg-white p-4 shadow-card transition-shadow hover:shadow-lg ${
        item.isAvailable ? "" : "opacity-60"
      }`}
    >
      <div className="hidden w-24 shrink-0 sm:block">
        <ImagePlaceholder ratio="aspect-square" label="Photo" className="!rounded-xl" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold leading-tight">
            <VegBadge isVeg={item.isVeg} />
            <span>{item.name}</span>
          </h3>
          <p className="shrink-0 font-semibold tabular-nums">₹{item.price}</p>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
          {item.isBestseller && (
            <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-xs font-medium text-terracotta">
              Bestseller
            </span>
          )}
          <SpiceIndicator level={item.spiceLevel} />
          {!item.isAvailable && <span className="text-xs font-medium text-muted">Currently unavailable</span>}
        </div>
        {item.addOns.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            Add-ons: {item.addOns.map((a) => `${a.name} (+₹${a.price})`).join(", ")}
          </p>
        )}
      </div>
    </article>
  );
}
