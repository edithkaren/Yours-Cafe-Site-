# Multi-Cuisine Café — Website

A modern, responsive website for a multi-cuisine café: menu browsing, table booking,
online-ordering links, offers, events, group dining, feedback, a loyalty waiting list,
and a staff dashboard.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, RLS) · Zod

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local     # optional for now; the site runs on sample data without it
npm run dev                    # http://localhost:3000
```

Without Supabase credentials the site works fully on built-in sample data. Reservations,
feedback, and other forms validate and confirm to the guest, but nothing is stored until
the backend is connected.

## 2. Edit your restaurant details

Everything the owner edits lives in one file: **`lib/config.ts`**.

- Name, phone, WhatsApp number (digits + country code), email, address
- Opening hours
- Swiggy and Zomato links (leave empty to hide the button)
- Google review link and Maps link
- Booking rules: slot length, seating duration, minimum notice, max guests
- About-page story text
- Loyalty toggle (keep `enabled: false` until the program is live)

Menu items, categories, offers, specials, and events are sample data in **`data/sample.ts`**
and are replaced by the database once Supabase is connected. Use the admin dashboard to
manage them after that.

## 3. Connect Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run **`supabase/schema.sql`**. This creates all tables and Row Level
   Security policies.
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose it)
   - `NEXT_PUBLIC_SITE_URL` (your live domain)
4. Create the first staff account: **Authentication → Users → Add user**. Then add that
   user's UUID to the admin list:
   ```sql
   insert into public.admins (user_id) values ('PASTE-USER-UUID-HERE');
   ```
5. Sign in at `/admin/login`.

Optional: `RESERVATION_LIMIT_PER_SLOT` (default 8) caps bookings per time slot.

## 4. Admin dashboard

Available at `/admin` after sign-in.

| Section | What staff can do |
|---|---|
| Reservations | See today's bookings and guest count, filter by date/status, confirm, complete, cancel, delete |
| Menu | Add/edit items, prices, categories, veg/spice/bestseller flags, add-ons, availability |
| Offers & Specials | Create, edit, show or hide |
| Events | Manage upcoming events |
| Gallery | Add image URLs (see below), hide, delete |
| Feedback | Review ratings and messages |
| Group inquiries | Review group-dining requests |
| Loyalty list | See waiting-list signups |
| Settings | Business details (stored in the database) |

## 5. Adding food photography later

Every menu card and category tile renders an **image-ready placeholder** (`components/ImagePlaceholder.tsx`).
When photos are ready:

1. Upload images to a Supabase Storage bucket (e.g. `food`), set it to public.
2. Put the public URL into `menu_items.image_url` (via the dashboard).
3. In `components/MenuCard.tsx` and `app/page.tsx`, swap the placeholder for Next's `<Image>`
   component. Keep the same aspect ratio so the layout does not shift.

No food images are generated or included in this build.

## 6. Going live

- **Deploy:** Vercel is the easiest option. Import the repo, add the environment variables,
  deploy.
- **Domain & metadata:** set `NEXT_PUBLIC_SITE_URL`. SEO tags, Open Graph, and
  Restaurant schema are generated from `lib/config.ts`.
- **Reviews:** replace `googleReviewLink` in `lib/config.ts` with your real review link.
- **Swiggy & Zomato:** only add store URLs you have been given. The site does not connect
  to their APIs.
- **Notifications (recommended):** connect reservation alerts (email/WhatsApp) using a
  Supabase Database Webhook or Edge Function. Not included in this build.

## 7. Security notes

- Public visitors can only read published content and submit forms. They cannot read
  other people's bookings or feedback. This is enforced by RLS in `supabase/schema.sql`.
- The admin dashboard checks the signed-in user against `public.admins` on every request.
- Forms validate on the server with Zod, and include a honeypot field to block simple bots.
- Add rate limiting (for example via Vercel's Firewall or Upstash) before launch if spam appears.

## Project layout

```
app/                 pages and API routes
  admin/             staff dashboard (protected)
  api/               form submissions and admin writes
components/          UI (navbar, menu browser, booking form, admin managers…)
data/sample.ts       sample menu/offers/events (replaced by the database)
lib/config.ts        ← edit restaurant details here
lib/booking.ts       slot generation and booking validation
lib/data.ts          reads from Supabase, falls back to sample data
supabase/schema.sql  database tables and security policies
```
