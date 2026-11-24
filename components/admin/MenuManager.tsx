"use client";

import { useState } from "react";
import { useAdminWrite, Notice } from "./useAdminWrite";

type Item = {
  id: string; category_id: string; name: string; description: string; price: number;
  is_veg: boolean; spice_level: number; is_bestseller: boolean; is_available: boolean;
  add_ons: { name: string; price: number }[];
};
type Cat = { id: string; name: string };

const blank = (categoryId: string) => ({
  category_id: categoryId, name: "", description: "", price: 0,
  is_veg: true, spice_level: 0, is_bestseller: false, is_available: true, add_ons: [],
});

export function MenuManager({ items, categories }: { items: Item[]; categories: Cat[] }) {
  const { write, pending, message } = useAdminWrite();
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [addOnsText, setAddOnsText] = useState("");

  const visible = items.filter((i) => filter === "all" || i.category_id === filter);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  function openEditor(item?: Item) {
    const v = item ?? blank(categories[0]?.id ?? "");
    setEditing(v);
    setAddOnsText((v.add_ons ?? []).map((a) => `${a.name}|${a.price}`).join("\n"));
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const add_ons = addOnsText.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const [name, price] = l.split("|");
      return { name: name.trim(), price: Number(price) || 0 };
    });
    const values = {
      category_id: editing.category_id,
      name: editing.name,
      description: editing.description ?? "",
      price: Number(editing.price) || 0,
      is_veg: !!editing.is_veg,
      spice_level: Number(editing.spice_level) || 0,
      is_bestseller: !!editing.is_bestseller,
      is_available: !!editing.is_available,
      add_ons,
    };
    const ok = editing.id
      ? await write({ table: "menu_items", action: "update", id: editing.id, values }, "Menu item updated")
      : await write({ table: "menu_items", action: "insert", values }, "Menu item added");
    if (ok) setEditing(null);
  }

  async function toggle(item: Item, key: "is_available" | "is_bestseller") {
    await write({ table: "menu_items", action: "update", id: item.id, values: { [key]: !item[key] } }, "Updated");
  }

  async function remove(item: Item) {
    if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    await write({ table: "menu_items", action: "delete", id: item.id }, "Menu item deleted");
  }

  return (
    <div>
      <Notice message={message} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <select aria-label="Filter by category" value={filter} onChange={(e) => setFilter(e.target.value)} className="field !w-auto !py-2">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button type="button" className="btn-primary" onClick={() => openEditor()}>Add menu item</button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-espresso/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-espresso/10 bg-beige/50">
            <tr>
              {["Name", "Category", "Price", "Veg", "Spice", "Bestseller", "Available", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => (
              <tr key={i.id} className="border-b border-espresso/5 last:border-0">
                <td className="px-4 py-3 font-medium">{i.name}</td>
                <td className="px-4 py-3 text-muted">{catName(i.category_id)}</td>
                <td className="px-4 py-3 tabular-nums">₹{i.price}</td>
                <td className="px-4 py-3">{i.is_veg ? "Veg" : "Non-veg"}</td>
                <td className="px-4 py-3">{i.spice_level}</td>
                <td className="px-4 py-3">
                  <button type="button" disabled={pending} onClick={() => toggle(i, "is_bestseller")} className="underline-offset-4 hover:underline">
                    {i.is_bestseller ? "Yes" : "No"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button type="button" disabled={pending} onClick={() => toggle(i, "is_available")} className="underline-offset-4 hover:underline">
                    {i.is_available ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button type="button" onClick={() => openEditor(i)} className="mr-3 font-semibold text-terracotta hover:underline">Edit</button>
                  <button type="button" onClick={() => remove(i)} className="text-muted hover:text-terracotta-deep">Delete</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-muted">No items in this category.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div role="dialog" aria-modal="true" aria-label={editing.id ? "Edit menu item" : "Add menu item"} className="fixed inset-0 z-50 grid place-items-center bg-espresso/40 p-4">
          <form onSubmit={save} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-6 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-medium">{editing.id ? "Edit menu item" : "Add menu item"}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="m-name">Name</label>
                <input id="m-name" required className="field" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="m-cat">Category</label>
                <select id="m-cat" className="field" value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="m-price">Price (₹)</label>
                <input id="m-price" type="number" min={0} step="1" required className="field" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="m-desc">Description</label>
                <textarea id="m-desc" rows={3} className="field" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="m-spice">Spice level</label>
                <select id="m-spice" className="field" value={editing.spice_level ?? 0} onChange={(e) => setEditing({ ...editing, spice_level: Number(e.target.value) })}>
                  <option value={0}>None</option><option value={1}>Mild</option><option value={2}>Medium</option><option value={3}>Hot</option>
                </select>
              </div>
              <div className="flex flex-col justify-end gap-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!editing.is_veg} onChange={(e) => setEditing({ ...editing, is_veg: e.target.checked })} /> Vegetarian</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!editing.is_bestseller} onChange={(e) => setEditing({ ...editing, is_bestseller: e.target.checked })} /> Bestseller</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_available ?? true} onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })} /> Available</label>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="m-addons">Add-ons (one per line: name|price)</label>
                <textarea id="m-addons" rows={3} className="field font-mono text-sm" value={addOnsText} onChange={(e) => setAddOnsText(e.target.value)} placeholder="Extra cheese|30" />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
