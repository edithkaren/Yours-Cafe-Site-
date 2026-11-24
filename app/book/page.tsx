import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ReservationForm } from "@/components/ReservationForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Book a Table" };

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Book your table."
        lead={`Choose a date, a time and your party size. Bookings are confirmed by our team. For bigger groups, try Group Dining.`}
      />
      <div className="container-x grid gap-12 pb-24 lg:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-medium">Good to know</h2>
            <ul className="mt-4 space-y-3 text-muted">
              <li>• Book at least {siteConfig.booking.minNoticeHours} hours ahead.</li>
              <li>• Tables are held for {siteConfig.booking.durationMinutes} minutes.</li>
              <li>• Need a cake or decoration? Mention it in special requests.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium">Prefer to call?</h2>
            <p className="mt-3 text-muted">
              <a className="font-semibold text-espresso underline-offset-4 hover:underline" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
            </p>
          </div>
        </aside>
        <ReservationForm />
      </div>
    </>
  );
}
