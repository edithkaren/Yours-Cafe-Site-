"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Category, MenuItem } from "@/lib/types";
import { MenuCard } from "@/components/MenuCard";

type Props = {
  categories: Category[];
  items: MenuItem[];
  initialCategory?: string;
};

export function MenuBrowser({ categories, items, initialCategory }: Props) {
  const [active, setActive] = useState<string>(initialCategory ?? "all");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [bestOnly, setBestOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (active !== "all" && i.categoryId !== active) return false;
      if (vegOnly && !i.isVeg) return false;
      if (bestOnly && !i.isBestseller) return false;
      if (q && !`${i.name} ${i.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, active, query, vegOnly, bestOnly]);

  const sections = useMemo(
    () =>
      categories
        .filter((c) => active === "all" || c.id === active)
        .map((c) => ({ category: c, items: filtered.filter((i) => i.categoryId === c.id) }))
        .filter((s) => s.items.length > 0),
    [categories, filtered, active]
  );

  const chip = (on: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
      on ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white hover:border-espresso/40"
    }`;

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-5 border-b border-espresso/10 bg-cream/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">Search the menu</span>
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, e.g. paneer, momos"
              className="field !rounded-full !py-3 !pl-11"
            />
          </label>

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
            <button type="button" className={chip(active === "all")} aria-pressed={active === "all"} onClick={() => setActive("all")}>
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={chip(active === c.id)}
                aria-pressed={active === c.id}
                onClick={() => setActive(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2" role="group" aria-label="Dietary and popularity filters">
            <button type="button" className={chip(vegOnly)} aria-pressed={vegOnly} onClick={() => setVegOnly((v) => !v)}>
              Veg only
            </button>
            <button type="button" className={chip(bestOnly)} aria-pressed={bestOnly} onClick={() => setBestOnly((v) => !v)}>
              Bestsellers
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-16" aria-live="polite">
        {sections.length === 0 && (
          <p className="py-16 text-center text-muted">Nothing matches that. Try a different search or clear the filters.</p>
        )}
        {sections.map(({ category, items: list }) => (
          <section key={category.id} id={category.slug} aria-labelledby={`h-${category.slug}`} className="scroll-mt-44">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-espresso/10 pb-4">
              <div>
                <h2 id={`h-${category.slug}`} className="font-display text-3xl font-medium">{category.name}</h2>
                <p className="mt-1 text-sm text-muted">{category.description}</p>
              </div>
              <span className="text-sm text-muted">{list.length} items</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((item) => <MenuCard key={item.id} item={item} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
