"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/config";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/offers", label: "Offers" },
  { href: "/book", label: "Book a Table" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur border-b border-espresso/10" : "bg-cream"
      }`}
    >
      <nav aria-label="Main" className="container-x flex h-18 items-center justify-between py-4">
        <Link href="/" aria-label={`${siteConfig.name} home`}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className="text-[15px] text-espresso/80 transition-colors hover:text-espresso aria-[current=page]:text-espresso aria-[current=page]:font-semibold"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/order" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Order Online
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile slide-out */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-espresso/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-cream p-6 shadow-card transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="mt-10 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-xl px-3 py-3 font-display text-2xl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Link href="/order" className="btn-primary">Order Online</Link>
            <Link href="/book" className="btn-ghost">Book a Table</Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
