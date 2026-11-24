import Link from "next/link";
import { ArrowRight, Clock, Flame, Truck, UtensilsCrossed } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getCategories, getSpecials, getOffers } from "@/lib/data";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const highlightIcons = [UtensilsCrossed, Flame, Clock, Truck];

export default async function Home() {
  const [categories, specials, offers] = await Promise.all([
    getCategories(),
    getSpecials(),
    getOffers(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="container-x grid items-end gap-12 pb-20 pt-12 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <p className="eyebrow">{siteConfig.tagline}</p>
          <h1 className="mt-4 font-display text-[2.6rem] font-medium leading-[1.02] tracking-tight sm:text-7xl">
            Good food.<br />
            <span className="italic text-terracotta">Great moments.</span><br />
            Every craving covered.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            From Indian favourites and Italian classics to spicy momos, Mexican bites, Chinese delights and
            loaded Frankie rolls — find something for every mood.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-primary">Explore Our Menu <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link href="/book" className="btn-ghost">Book Your Table</Link>
            <Link href="/order" className="btn-ghost">Order Online</Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3" aria-label="Highlights">
            {siteConfig.heroHighlights.map((h, i) => {
              const Icon = highlightIcons[i % highlightIcons.length];
              return (
                <li key={h} className="flex items-center gap-2 text-sm text-espresso/80">
                  <Icon className="h-4 w-4 text-terracotta" aria-hidden />
                  {h}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="md:col-span-5">
          <ImagePlaceholder ratio="aspect-[4/5]" label="Hero photo — add later" className="!rounded-[2rem]" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section aria-labelledby="cats" className="container-x">
        <div className="flex items-end justify-between gap-6 border-b border-espresso/10 pb-5">
          <h2 id="cats" className="font-display text-3xl font-medium sm:text-4xl">Browse by cuisine</h2>
          <Link href="/menu" className="hidden text-sm font-semibold text-terracotta hover:underline sm:inline">View full menu</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/menu?category=${c.id}`}
                className="group block rounded-2xl border border-espresso/10 bg-white p-4 transition-colors hover:border-terracotta/40"
              >
                <ImagePlaceholder ratio="aspect-[4/3]" label={c.name} className="!rounded-xl" />
                <h3 className="mt-4 font-display text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ONLINE ORDER STRIP */}
      <section aria-labelledby="order-h" className="container-x mt-24">
        <div className="grid gap-8 rounded-[2rem] bg-espresso p-8 text-cream sm:p-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium text-beige/80">Hungry right now?</p>
            <h2 id="order-h" className="mt-2 font-display text-3xl font-medium sm:text-4xl">Order it your way.</h2>
            <p className="mt-3 max-w-md text-cream/75">Pick your favourite app or order directly from us.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/order" className="btn-primary">Order Online</Link>
            {siteConfig.swiggyLink && <a href={siteConfig.swiggyLink} target="_blank" rel="noopener noreferrer" className="btn-ghost !border-cream/30 !text-cream hover:!bg-cream hover:!text-espresso">Swiggy</a>}
            {siteConfig.zomatoLink && <a href={siteConfig.zomatoLink} target="_blank" rel="noopener noreferrer" className="btn-ghost !border-cream/30 !text-cream hover:!bg-cream hover:!text-espresso">Zomato</a>}
          </div>
        </div>
      </section>

      {/* TODAY'S SPECIALS */}
      {specials.length > 0 && (
        <section aria-labelledby="spec-h" className="container-x mt-24">
          <h2 id="spec-h" className="font-display text-3xl font-medium sm:text-4xl">Today's specials</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {specials.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-6 rounded-2xl border border-espresso/10 bg-white p-6">
                <div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{s.description}</p>
                </div>
                {s.price != null && <p className="shrink-0 font-semibold tabular-nums">₹{s.price}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* OFFERS PREVIEW */}
      {offers.length > 0 && (
        <section aria-labelledby="off-h" className="container-x mt-24">
          <div className="flex items-end justify-between gap-6">
            <h2 id="off-h" className="font-display text-3xl font-medium sm:text-4xl">Offers</h2>
            <Link href="/offers" className="text-sm font-semibold text-terracotta hover:underline">All offers</Link>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {offers.slice(0, 2).map((o) => (
              <li key={o.id} className="rounded-2xl border-l-4 border-terracotta bg-beige/50 p-6">
                <h3 className="font-display text-xl font-semibold">{o.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{o.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FEATURE CTA ROW */}
      <section aria-labelledby="more-h" className="container-x mt-24 grid gap-4 md:grid-cols-3">
        <h2 id="more-h" className="sr-only">More ways to visit</h2>
        {[
          { href: "/group-dining", t: "Group dining", d: "Birthdays, office lunches and family gatherings." },
          { href: "/events", t: "Events", d: "Live nights and festive celebrations." },
          { href: "/feedback", t: "Tell us how we did", d: "Your feedback shapes the next visit." },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="group rounded-2xl border border-espresso/10 bg-white p-6 transition-colors hover:border-terracotta/40">
            <h3 className="font-display text-xl font-semibold">{x.t}</h3>
            <p className="mt-2 text-sm text-muted">{x.d}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-terracotta">
              Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
