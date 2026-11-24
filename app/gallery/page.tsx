import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export const metadata: Metadata = { title: "Gallery" };

const categories = ["Café Interior", "Food", "Events", "Guests", "Behind the Scenes"];

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="A look inside." lead="Photos from the café, our kitchen and our guests will appear here." />
      <div className="container-x space-y-16 pb-24">
        {categories.map((c) => (
          <section key={c} aria-labelledby={`g-${c}`}>
            <h2 id={`g-${c}`} className="font-display text-2xl font-medium">{c}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <ImagePlaceholder key={i} ratio="aspect-square" label={`${c} — photo ${i + 1}`} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
