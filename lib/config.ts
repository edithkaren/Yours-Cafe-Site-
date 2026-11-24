/**
 * Central place for everything the owner edits.
 * Replace the placeholder values with the real details before launch.
 */
export const siteConfig = {
  name: "Your Café Name",
  tagline: "Multi-cuisine café & restaurant",
  description:
    "Indian favourites, Italian classics, Mexican bites, Chinese delights, momos and loaded Frankie rolls — find something for every mood.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+91 00000 00000",
  whatsapp: "910000000000", // digits only, country code included
  email: "hello@yourcafe.example",
  address: "Add full street address, Indore, Madhya Pradesh",
  mapsEmbedQuery: "Indore, Madhya Pradesh",
  mapsLink: "https://maps.google.com/?q=Indore",
  googleReviewLink: "https://g.page/r/REPLACE_WITH_REVIEW_LINK",
  swiggyLink: "", // leave empty to hide the button
  zomatoLink: "", // leave empty to hide the button
  socials: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
  hours: [
    { day: "Monday – Thursday", time: "11:00 AM – 11:00 PM" },
    { day: "Friday – Sunday", time: "11:00 AM – 12:00 AM" },
  ],
  booking: {
    slotMinutes: 30,
    durationMinutes: 90,
    minNoticeHours: 2,
    maxGuests: 12,
    // Seating options; set available:false to hide
    seating: [
      { id: "indoor", label: "Indoor", available: true },
      { id: "outdoor", label: "Outdoor", available: true },
    ],
  },
  heroHighlights: [
    "Multi-Cuisine Menu",
    "Freshly Prepared",
    "Dine-In & Takeaway",
    "Online Ordering",
  ],
  about: {
    story:
      "Replace this with the restaurant's story — how it started, what it stands for, and why people keep coming back.",
    founder:
      "Replace with the founder's story in their own words. A short personal note works best here.",
    philosophy:
      "Good food is made with care, shared generously, and served without fuss.",
    foodApproach:
      "Fresh ingredients, cooked to order, with recipes adapted for every cuisine we serve.",
    hospitality:
      "Every guest is welcome. We want you to feel at home from the first hello.",
  },
  loyalty: {
    enabled: false, // set true only when the program is live
    headline: "Good food deserves rewards.",
  },
};

export type SiteConfig = typeof siteConfig;
