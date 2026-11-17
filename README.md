# MAISON ALVARO — Luxury Perfume Store

Static e-commerce site (Next.js 15 App Router, TypeScript, Tailwind CSS) with product detail pages,
cart, Cash-on-Delivery checkout and an admin area for products and orders.

> **All catalogue content is clearly labelled demo data** (`src/data/seed.ts`): product names, prices,
> notes, reviews and testimonials are placeholders, and images are neutral placeholders in
> `public/images/placeholder/`. Nothing invented is presented as real.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site is written to ./out
```

With no environment variables the site runs in **demo mode**: products added in `/admin` and orders
placed at checkout are stored only in the visitor's own browser. This is perfect for previewing, but
**customer orders will not reach you** until Firebase is configured (below).

## Pages

| URL | What it is |
| --- | --- |
| `/` | Homepage (announcement bar, hero, collections, best sellers, signatures, brand story, gift sets, testimonials, newsletter, footer) |
| `/shop/`, `/collections/`, `/collections/[slug]/` | Shop with filters/sorting, collection pages |
| `/products/[slug]/` | **Product detail page** — every product card links here |
| `/cart/`, `/checkout/`, `/order-confirmation/` | Bag, Cash-on-Delivery checkout, confirmation |
| `/admin/` | Orders: filter, search, view details, change status, export CSV |
| `/admin/products/` | Add / edit / hide / delete products, upload images |

## Product pages

* One unique URL per product (`/products/demo-fragrance-01/`), with its own title, description,
  canonical URL, Open Graph tags and Product JSON-LD.
* Gallery with thumbnails, hover zoom and a full-screen viewer; size selector, quantity, Add to Cart,
  Buy Now (adds to the bag and goes straight to checkout), delivery info.
* Description, fragrance notes, ingredients (only shown when provided), specifications, reviews,
  related fragrances and recently viewed.
* States: loading skeleton, not found, unavailable (hidden product), load error with retry,
  out of stock (buttons disabled).
* Direct URLs and refresh work. Products created in `/admin` **after** a build are served by the
  `/products/_shell/` page through a hosting rewrite (already configured for Firebase Hosting, Vercel
  and Netlify) and resolved by slug in the browser.

## Going live with real orders (Firebase)

1. Create a Firebase project → enable **Firestore** and **Authentication → Email/Password**.
2. Authentication → Users → **Add user** (your admin email + password). Copy that user's **UID**.
3. Put the UID in `firestore.rules` (replace `REPLACE_WITH_ADMIN_UID`) and publish the rules
   (`firebase deploy --only firestore:rules`).
4. Copy `.env.example` → `.env.local` and fill in the Firebase web-app keys and `NEXT_PUBLIC_SITE_URL`.
5. `npm run build`, then deploy `./out` (`firebase deploy --only hosting`, Vercel or Netlify).
6. Open `/admin/`, sign in, and add products (or click **Import demo products** to preview the store).

### Product images (Cloudinary)

Create a Cloudinary account and an **unsigned upload preset**, then set
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Without it you can
still paste image URLs in the product form.

## Replacing demo data

* **Recommended:** delete the demo products in `/admin/products/` and add real ones.
* Replace the placeholder hero/brand imagery, the brand story (`BrandStory.tsx`, `about/page.tsx`),
  contact details (`contact/page.tsx`) and the testimonials (`src/data/seed.ts` → `demoTestimonials`).
* Delivery fee is `siteConfig.deliveryFee` in `src/data/seed.ts` (currently `0` = free delivery).

## Architecture notes

* `src/lib/repo/` — one `Repository` interface with two implementations: **demo** (localStorage) and
  **Firebase/Firestore**. Swapping to another backend only means adding a third implementation.
* `src/context/CatalogContext.tsx` — loads products; `CartContext.tsx` — stores only
  `{productId, size, quantity}` and always prices lines from the live catalogue.
* Brand tokens are in `tailwind.config.ts` (Obsidian `#090707`, Espresso `#30201B`, Antique Gold
  `#D6A65B`, Royal Crimson `#9E171D`, Champagne Ivory `#F3EBDD`).

## Known limitations of a static site (worth knowing)

* **Prices are not verified on a server.** A technically skilled visitor could tamper with the price in
  their browser before placing an order. Always check order totals in `/admin/` before dispatching; a
  server-side order function (e.g. Firebase Cloud Functions) is the upgrade path if you need enforcement.
* Hidden (unpublished) products are not secret — Firestore products are publicly readable.
* `sitemap.xml` lists only the demo products; add real product URLs when you have them.
* Customers cannot look up past orders (no customer accounts); the confirmation page shows the order
  number just placed.
