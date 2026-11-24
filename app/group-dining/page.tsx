import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SimpleForm } from "@/components/SimpleForm";

export const metadata: Metadata = { title: "Group Dining" };

export default function GroupDiningPage() {
  return (
    <>
      <PageHeader eyebrow="Group dining" title="Bring the whole table." lead="Birthdays, friend meetups, family dinners and office lunches. Tell us what you have in mind and we'll arrange the rest." />
      <div className="container-x grid gap-12 pb-24 lg:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-4 text-muted">
          <h2 className="font-display text-2xl font-medium text-espresso">What we can plan</h2>
          <ul className="space-y-2">
            <li>• Set menus for 6 or more</li>
            <li>• Shared platters and starters</li>
            <li>• Birthday arrangements, staff to confirm</li>
          </ul>
          <p className="pt-4 text-sm">Final arrangements are confirmed by our team after we speak with you.</p>
        </aside>
        <SimpleForm
          endpoint="/api/group-inquiries"
          submitLabel="Send inquiry"
          successTitle="Inquiry received."
          successBody={<>Thanks! Our team will get back to you shortly to plan your group visit.</>}
          fields={[
            { name: "name", label: "Your name", required: true },
            { name: "phone", label: "Phone number", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "inquiryDate", label: "Preferred date", type: "date" },
            { name: "guests", label: "Number of guests", type: "number", required: true, min: 6, max: 500, defaultValue: 6 },
            { name: "occasion", label: "Occasion", type: "select", defaultValue: "friends", options: [
              { v: "birthday", l: "Birthday" }, { v: "friends", l: "Friends meetup" }, { v: "celebration", l: "Small celebration" },
              { v: "family", l: "Family dinner" }, { v: "office", l: "Office lunch" }, { v: "other", l: "Other" },
            ] },
            { name: "message", label: "Tell us more", type: "textarea" },
          ]}
        />
      </div>
    </>
  );
}
