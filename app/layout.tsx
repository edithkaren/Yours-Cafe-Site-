import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/instrument-sans";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFF9F0",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: siteConfig.name,
  description: siteConfig.description,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  url: siteConfig.url,
  address: siteConfig.address,
  servesCuisine: ["Indian", "Italian", "Mexican", "Chinese", "Momos", "Street Food"],
  openingHours: siteConfig.hours.map((h) => h.day + " " + h.time),
  hasMenu: `${siteConfig.url}/menu`,
  acceptsReservations: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
