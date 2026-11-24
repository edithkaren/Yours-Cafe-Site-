import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <PageHeader eyebrow="Events" title="Festive nights and café moments." lead="Special menus, live sessions and celebrations, managed by our team." />
      <div className="container-x pb-24">
        {events.length === 0 ? (
          <p className="text-muted">No upcoming events yet. Follow us for updates.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {events.map((e) => (
              <li key={e.id} className="rounded-2xl border border-espresso/10 bg-white p-6 shadow-card">
                <p className="eyebrow">{e.eventDate}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">{e.title}</h2>
                <p className="mt-2 text-muted">{e.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
