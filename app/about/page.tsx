import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Our Story" };

export default function AboutPage() {
  const a = siteConfig.about;
  const blocks = [
    { t: "The restaurant story", b: a.story },
    { t: "The founder's story", b: a.founder },
    { t: "Our philosophy", b: a.philosophy },
    { t: "Our food approach", b: a.foodApproach },
    { t: "Hospitality values", b: a.hospitality },
  ];
  return (
    <>
      <PageHeader eyebrow="Our story" title="More than a meal. A place to make memories." />
      <div className="container-x grid gap-12 pb-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <ImagePlaceholder ratio="aspect-[4/5]" label="Founder or café photo — add later" />
        </div>
        <div className="space-y-10 md:col-span-7">
          {blocks.map((x) => (
            <section key={x.t}>
              <h2 className="font-display text-2xl font-medium">{x.t}</h2>
              <p className="mt-3 max-w-prose text-lg leading-relaxed text-espresso/80">{x.b}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
