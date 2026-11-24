"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { MenuManager } from "./MenuManager";
import { ReservationManager } from "./ReservationManager";
import { SimpleListManager } from "./SimpleListManager";
import { SettingsManager } from "./SettingsManager";

export type AdminData = {
  menu: any[];
  categories: any[];
  reservations: any[];
  offers: any[];
  specials: any[];
  events: any[];
  gallery: any[];
  feedback: any[];
  groups: any[];
  loyalty: any[];
  settings: any[];
};

const tabs = [
  { id: "reservations", label: "Reservations" },
  { id: "menu", label: "Menu" },
  { id: "offers", label: "Offers & Specials" },
  { id: "events", label: "Events" },
  { id: "gallery", label: "Gallery" },
  { id: "feedback", label: "Feedback" },
  { id: "groups", label: "Group Inquiries" },
  { id: "loyalty", label: "Loyalty List" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminDashboard({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<TabId>("reservations");
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Staff dashboard</p>
          <h1 className="mt-1 font-display text-4xl font-medium">Café management</h1>
        </div>
        <button type="button" onClick={signOut} className="btn-ghost">
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </button>
      </div>

      <div role="tablist" aria-label="Dashboard sections" className="mt-8 -mx-5 flex gap-1 overflow-x-auto border-b border-espresso/10 px-5 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id ? "border-terracotta text-espresso" : "border-transparent text-muted hover:text-espresso"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
        {tab === "reservations" && <ReservationManager rows={data.reservations} />}
        {tab === "menu" && <MenuManager items={data.menu} categories={data.categories} />}
        {tab === "offers" && (
          <div className="grid gap-10 xl:grid-cols-2">
            <SimpleListManager
              title="Offers"
              table="offers"
              rows={data.offers}
              fields={[
                { key: "title", label: "Title", required: true },
                { key: "description", label: "Description", multiline: true },
                { key: "is_active", label: "Active", type: "boolean" },
              ]}
            />
            <SimpleListManager
              title="Specials"
              table="specials"
              rows={data.specials}
              fields={[
                { key: "title", label: "Title", required: true },
                { key: "description", label: "Description", multiline: true },
                { key: "price", label: "Price (₹)", type: "number" },
                { key: "is_active", label: "Active", type: "boolean" },
              ]}
            />
          </div>
        )}
        {tab === "events" && (
          <SimpleListManager
            title="Events"
            table="events"
            rows={data.events}
            fields={[
              { key: "title", label: "Title", required: true },
              { key: "event_date", label: "When (e.g. Every Thursday, 12 Dec)" },
              { key: "description", label: "Description", multiline: true },
              { key: "is_active", label: "Visible", type: "boolean" },
            ]}
          />
        )}
        {tab === "gallery" && (
          <SimpleListManager
            title="Gallery"
            table="gallery_images"
            rows={data.gallery}
            fields={[
              { key: "category", label: "Category", required: true },
              { key: "image_url", label: "Image URL (from Supabase Storage)", required: true },
              { key: "alt_text", label: "Alt text (describe the photo)" },
              { key: "is_visible", label: "Visible", type: "boolean" },
            ]}
          />
        )}
        {tab === "feedback" && <FeedbackList rows={data.feedback} />}
        {tab === "groups" && <GroupList rows={data.groups} />}
        {tab === "loyalty" && <LoyaltyList rows={data.loyalty} />}
        {tab === "settings" && <SettingsManager rows={data.settings} />}
      </div>
    </div>
  );
}

function FeedbackList({ rows }: { rows: any[] }) {
  return <ReadOnlyTable headers={["Date", "Name", "Overall", "Food", "Service", "Ambience", "Message", "Public"]} rows={rows.map((r) => [
    new Date(r.created_at).toLocaleDateString("en-IN"), r.name || "—", r.overall_rating, r.food_rating ?? "—", r.service_rating ?? "—", r.ambience_rating ?? "—", r.message, r.is_public ? "Yes" : "No",
  ])} empty="No feedback yet." />;
}

function GroupList({ rows }: { rows: any[] }) {
  return <ReadOnlyTable headers={["Received", "Name", "Phone", "Email", "Date", "Guests", "Occasion", "Message"]} rows={rows.map((r) => [
    new Date(r.created_at).toLocaleDateString("en-IN"), r.name, r.phone, r.email || "—", r.inquiry_date || "—", r.guests, r.occasion, r.message || "—",
  ])} empty="No group inquiries yet." />;
}

function LoyaltyList({ rows }: { rows: any[] }) {
  return <ReadOnlyTable headers={["Joined", "Name", "Contact"]} rows={rows.map((r) => [
    new Date(r.created_at).toLocaleDateString("en-IN"), r.name, r.contact,
  ])} empty="Nobody on the list yet." />;
}

export function ReadOnlyTable({ headers, rows, empty }: { headers: string[]; rows: (string | number)[][]; empty: string }) {
  if (rows.length === 0) return <p className="text-muted">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-espresso/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-espresso/10 bg-beige/50">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-espresso/5 last:border-0 align-top">
              {r.map((c, j) => <td key={j} className="px-4 py-3">{String(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
