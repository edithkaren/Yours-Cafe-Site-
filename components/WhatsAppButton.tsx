import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function WhatsAppButton() {
  if (!siteConfig.whatsapp) return null;
  const href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hi ${siteConfig.name}, I'd like to know more.`
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-olive px-4 py-3 text-sm font-semibold text-cream shadow-card transition-transform hover:-translate-y-0.5 focus-visible:ring-olive"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
