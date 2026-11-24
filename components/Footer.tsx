import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const social = Object.entries(siteConfig.socials).filter(([, v]) => v);
  return (
    <footer className="mt-24 border-t border-espresso/10 bg-beige/50">
      <div className="container-x grid gap-12 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/menu" className="hover:text-espresso">Menu</Link></li>
            <li><Link href="/offers" className="hover:text-espresso">Offers</Link></li>
            <li><Link href="/events" className="hover:text-espresso">Events</Link></li>
            <li><Link href="/gallery" className="hover:text-espresso">Gallery</Link></li>
            <li><Link href="/about" className="hover:text-espresso">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Visit & Order</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/book" className="hover:text-espresso">Book a Table</Link></li>
            <li><Link href="/group-dining" className="hover:text-espresso">Group Dining</Link></li>
            <li><Link href="/order" className="hover:text-espresso">Order Online</Link></li>
            {siteConfig.swiggyLink && <li><a href={siteConfig.swiggyLink} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">Swiggy</a></li>}
            {siteConfig.zomatoLink && <li><a href={siteConfig.zomatoLink} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">Zomato</a></li>}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>{siteConfig.address}</li>
            <li><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-espresso">{siteConfig.phone}</a></li>
            <li><a href={`mailto:${siteConfig.email}`} className="hover:text-espresso">{siteConfig.email}</a></li>
          </ul>
          {social.length > 0 && (
            <ul className="mt-5 flex gap-4 text-sm">
              {social.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-muted hover:text-espresso">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-espresso/10 py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p>Made with care in Indore.</p>
      </div>
    </footer>
  );
}
