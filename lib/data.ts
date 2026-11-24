import { categories as sampleCategories, menuItems as sampleItems, offers as sampleOffers, specials as sampleSpecials, events as sampleEvents } from "@/data/sample";
import type { Category, MenuItem, Offer, Special, EventItem } from "@/lib/types";
import { getPublicClient, supabaseConfigured } from "@/lib/supabase";

/**
 * Each getter reads Supabase when configured and falls back to sample data.
 * This keeps the site fully working before the backend is connected.
 */

export async function getCategories(): Promise<Category[]> {
  const sb = getPublicClient();
  if (!sb) return sampleCategories;
  const { data, error } = await sb.from("menu_categories").select("*").order("sort_order");
  if (error || !data) return sampleCategories;
  return data.map((r) => ({ id: r.id, slug: r.slug, name: r.name, description: r.description, sortOrder: r.sort_order }));
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const sb = getPublicClient();
  if (!sb) return sampleItems;
  const { data, error } = await sb.from("menu_items").select("*").order("sort_order");
  if (error || !data) return sampleItems;
  return data.map((r) => ({
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    description: r.description,
    price: Number(r.price),
    isVeg: r.is_veg,
    spiceLevel: r.spice_level,
    isBestseller: r.is_bestseller,
    isAvailable: r.is_available,
    addOns: r.add_ons ?? [],
    imageUrl: r.image_url,
  }));
}

export async function getOffers(): Promise<Offer[]> {
  const sb = getPublicClient();
  if (!sb) return sampleOffers;
  const { data, error } = await sb.from("offers").select("*").eq("is_active", true);
  if (error || !data) return sampleOffers;
  return data.map((r) => ({ id: r.id, title: r.title, description: r.description, startsAt: r.starts_at, endsAt: r.ends_at, isActive: r.is_active }));
}

export async function getSpecials(): Promise<Special[]> {
  const sb = getPublicClient();
  if (!sb) return sampleSpecials;
  const { data, error } = await sb.from("specials").select("*").eq("is_active", true);
  if (error || !data) return sampleSpecials;
  return data.map((r) => ({ id: r.id, title: r.title, description: r.description, price: r.price == null ? null : Number(r.price), isActive: r.is_active }));
}

export async function getEvents(): Promise<EventItem[]> {
  const sb = getPublicClient();
  if (!sb) return sampleEvents;
  const { data, error } = await sb.from("events").select("*").eq("is_active", true);
  if (error || !data) return sampleEvents;
  return data.map((r) => ({ id: r.id, title: r.title, description: r.description, eventDate: r.event_date, isActive: r.is_active }));
}

export { supabaseConfigured };
