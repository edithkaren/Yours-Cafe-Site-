import type { Metadata } from "next";
import { Phone, Mail, MapPin, Navigation, MessageCircle, CalendarDays } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Contact & Location" };

export default function ContactPage() {
  const tel = siteConfig.phone.replace(/\s/g, "");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapsEmbedQuery)}&output=embed`;
  return (
    <>
      <PageHeader eyebrow="Visit us" title="We'd love to see you." />
      <div className="container-x grid gap-10 pb-24 lg:grid-cols-2">
        <div className="space-y-8">
          <ul className="space-y-6">
            <li className="flex gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-terracotta" aria-hidden /><div><h2 className="font-semibold">Address</h2><p className="text-muted">{siteConfig.address}</p></div></li>
            <li className="flex gap-4"><Phone className="mt-1 h-5 w-5 shrink-0 text-terracotta" aria-hidden /><div><h2 className="font-semibold">Phone</h2><a href={`tel:${tel}`} className="text-muted hover:text-espresso">{siteConfig.phone}</a></div></li>
            <li className="flex gap-4"><Mail className="mt-1 h-5 w-5 shrink-0 text-terracotta" aria-hidden /><div><h2 className="font-semibold">Email</h2><a href={`mailto:${siteConfig.email}`} className="text-muted hover:text-espresso">{siteConfig.email}</a></div></li>
            <li className="flex gap-4"><CalendarDays className="mt-1 h-5 w-5 shrink-0 text-terracotta" aria-hidden /><div><h2 className="font-semibold">Opening hours</h2><ul className="mt-1 text-muted">{siteConfig.hours.map((h) => <li key={h.day}>{h.day}: {h.time}</li>)}</ul></div></li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href={siteConfig.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-primary"><Navigation className="h-4 w-4" aria-hidden /> Get Directions</a>
            <a href={`tel:${tel}`} className="btn-ghost"><Phone className="h-4 w-4" aria-hidden /> Call Now</a>
            {siteConfig.whatsapp && <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp Us</a>}
            <Link href="/book" className="btn-ghost">Book a Table</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-espresso/10 bg-beige">
          <iframe title="Map of the café location" src={mapSrc} className="h-[420px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </>
  );
}
