import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Order Online" };

export default function OrderPage() {
  const options = [
    { label: "Order on Swiggy", href: siteConfig.swiggyLink, primary: true },
    { label: "Order on Zomato", href: siteConfig.zomatoLink, primary: false },
  ];
  return (
    <>
      <PageHeader eyebrow="Order online" title="Hungry? Order your way." lead="Choose the app you use, or call us to order directly." />
      <div className="container-x pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {options.map((o) => (
            <div key={o.label} className="rounded-2xl border border-espresso/10 bg-white p-6">
              <h2 className="font-display text-xl font-semibold">{o.label.replace("Order on ", "")}</h2>
              {o.href ? (
                <a href={o.href} target="_blank" rel="noopener noreferrer" className={`mt-5 ${o.primary ? "btn-primary" : "btn-ghost"} w-full`}>{o.label}</a>
              ) : (
                <p className="mt-4 text-sm text-muted">Link coming soon. Add it in site settings.</p>
              )}
            </div>
          ))}
          <div className="rounded-2xl border border-espresso/10 bg-white p-6">
            <h2 className="font-display text-xl font-semibold">Order directly</h2>
            <p className="mt-2 text-sm text-muted">Call us or message on WhatsApp for takeaway.</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="btn-primary w-full">Call to order</a>
              {siteConfig.whatsapp && <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">WhatsApp</a>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
