import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { MenuBrowser } from "@/components/MenuBrowser";
import { getCategories, getMenuItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore our multi-cuisine menu: Indian, Italian, Mexican, Chinese, momos, frankies, snacks, beverages and desserts.",
};

export default async function MenuPage({ searchParams }: { searchParams: { category?: string } }) {
  const [categories, items] = await Promise.all([getCategories(), getMenuItems()]);
  return (
    <>
      <PageHeader
        eyebrow="Our menu"
        title="Something for every mood."
        lead="Browse by cuisine, search for a favourite, or filter for veg and bestsellers."
      />
      <div className="container-x pb-24">
        <MenuBrowser categories={categories} items={items} initialCategory={searchParams.category} />
      </div>
    </>
  );
}
