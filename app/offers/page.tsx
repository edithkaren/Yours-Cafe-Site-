import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getOffers, getSpecials } from "@/lib/data";

export const metadata: Metadata = { title: "Offers" };

export default async function OffersPage() {
  const [offers, specials] = await Promise.all([getOffers(), getSpecials()]);
  return (
    <>
      <PageHeader eyebrow="Offers" title="Good deals, shared generously." lead="Happy hours, combos and seasonal treats. Offer details are kept up to date by our team." />
      <div className="container-x space-y-16 pb-24">
        <section aria-labelledby="off">
          <h2 id="off" className="font-display text-3xl font-medium">Current offers</h2>
          {offers.length === 0 ? (
            <p className="mt-4 text-muted">No active offers right now. Check back soon.</p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {offers.map((o) => (
                <li key={o.id} className="rounded-2xl border-l-4 border-terracotta bg-white p-6 shadow-card">
                  <h3 className="font-display text-xl font-semibold">{o.title}</h3>
                  <p className="mt-2 text-muted">{o.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="spec">
          <h2 id="spec" className="font-display text-3xl font-medium">Specials</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {specials.map((s) => (
              <li key={s.id} className="rounded-2xl border border-espresso/10 bg-white p-6">
                <div className="flex justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  {s.price != null && <span className="font-semibold tabular-nums">₹{s.price}</span>}
                </div>
                <p className="mt-2 text-muted">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
