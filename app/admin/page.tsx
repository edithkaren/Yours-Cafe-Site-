import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { sb } = await requireAdmin();

  const [menu, cats, bookings, offers, specials, events, gallery, feedback, groups, loyalty, settings] = await Promise.all([
    sb.from("menu_items").select("*").order("sort_order"),
    sb.from("menu_categories").select("*").order("sort_order"),
    sb.from("reservations").select("*").order("reservation_date", { ascending: true }).order("reservation_time", { ascending: true }).limit(200),
    sb.from("offers").select("*").order("created_at", { ascending: false }),
    sb.from("specials").select("*").order("created_at", { ascending: false }),
    sb.from("events").select("*").order("created_at", { ascending: false }),
    sb.from("gallery_images").select("*").order("created_at", { ascending: false }),
    sb.from("feedback").select("*").order("created_at", { ascending: false }).limit(200),
    sb.from("group_inquiries").select("*").order("created_at", { ascending: false }).limit(200),
    sb.from("loyalty_signups").select("*").order("created_at", { ascending: false }).limit(500),
    sb.from("site_settings").select("*"),
  ]);

  return (
    <AdminDashboard
      data={{
        menu: menu.data ?? [],
        categories: cats.data ?? [],
        reservations: bookings.data ?? [],
        offers: offers.data ?? [],
        specials: specials.data ?? [],
        events: events.data ?? [],
        gallery: gallery.data ?? [],
        feedback: feedback.data ?? [],
        groups: groups.data ?? [],
        loyalty: loyalty.data ?? [],
        settings: settings.data ?? [],
      }}
    />
  );
}
