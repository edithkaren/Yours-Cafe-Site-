import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SimpleForm } from "@/components/SimpleForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Feedback" };

export default function FeedbackPage() {
  return (
    <>
      <PageHeader eyebrow="Feedback" title="How did we do?" lead="Your feedback helps us cook better and serve warmer. Every message is read by our team." />
      <div className="container-x grid gap-12 pb-24 lg:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-6 text-muted">
          <div>
            <h2 className="font-display text-2xl font-medium text-espresso">Enjoyed your visit?</h2>
            <p className="mt-2">A public review helps other guests find us.</p>
            <a href={siteConfig.googleReviewLink} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4">Review us on Google</a>
          </div>
        </aside>
        <SimpleForm
          endpoint="/api/feedback"
          submitLabel="Send feedback"
          successTitle="Thank you."
          successBody={<>We really appreciate you taking the time. It goes straight to our team.</>}
          fields={[
            { name: "name", label: "Your name" },
            { name: "visitDate", label: "Visit date", type: "date" },
            { name: "overall", label: "Overall rating (1–5)", type: "number", required: true, min: 1, max: 5, defaultValue: 5 },
            { name: "food", label: "Food rating (1–5)", type: "number", min: 1, max: 5, defaultValue: 5 },
            { name: "service", label: "Service rating (1–5)", type: "number", min: 1, max: 5, defaultValue: 5 },
            { name: "ambience", label: "Ambience rating (1–5)", type: "number", min: 1, max: 5, defaultValue: 5 },
            { name: "message", label: "Your feedback", type: "textarea", required: true },
          ]}
        />
      </div>
    </>
  );
}
