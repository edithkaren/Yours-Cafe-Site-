import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SimpleForm } from "@/components/SimpleForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Loyalty — Coming Soon" };

export default function LoyaltyPage() {
  return (
    <>
      <PageHeader eyebrow="Coming soon" title={siteConfig.loyalty.headline} lead="We're designing a loyalty program for regulars. Join the waiting list and we'll let you know the moment it's ready. No rewards are active yet." />
      <div className="container-x pb-24">
        <div className="mx-auto max-w-2xl">
          <SimpleForm
            endpoint="/api/loyalty"
            submitLabel="Join the waiting list"
            successTitle="You're on the list."
            successBody={<>We'll reach out when the program launches. Thanks for being part of the family.</>}
            fields={[
              { name: "name", label: "Your name", required: true },
              { name: "contact", label: "Phone number or email", required: true, hint: "Used only to tell you about the program." },
            ]}
          />
        </div>
      </div>
    </>
  );
}
