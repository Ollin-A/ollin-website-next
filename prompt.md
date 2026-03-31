# prompt.md — Build Orchestration Guide

## Purpose

This document tells you **how to execute** the migration defined in `CLAUDE.md`. Read `CLAUDE.md` first for the full technical specification. This document breaks that spec into ordered, self-contained tasks with clear entry/exit criteria so you can execute reliably without losing context or making conflicting changes.

---

## Ground Rules

### How to Work

1. **Complete one phase fully before starting the next.** Each phase has a verification step. Do not skip it.
2. **Within a phase, complete tasks in the listed order.** Dependencies flow top-to-bottom.
3. **After creating or modifying any file, verify it compiles** by running the appropriate check (see Verification Commands below).
4. **When porting a component from the old codebase**, do not copy-paste blindly. Apply all improvements listed in the task. The migration IS the refactor.
5. **If a task says "port from [file]"**, open the source file, understand what it does, then rewrite it for the Next.js context — applying the improvements noted. Do not create a 1:1 copy unless explicitly told to.
6. **Keep every commit atomic.** One task = one logical commit. If a task is large, split it into sub-commits, but never leave the project in a broken state between tasks.
7. **Keep commentary to a minimum.** Only comment if it's necessary to explain a complex decision or a deviation from the spec.

### How NOT to Work

- **Do not install dependencies that aren't in the CLAUDE.md dependency list.** If you think something is needed, check the list first.
- **Do not create barrel files (index.ts) for components** unless the original codebase had them AND they serve a clear purpose (like `components/shared/services/index.ts`).
- **Do not add `'use client'` to page.tsx files** unless absolutely required. Pages should be Server Components that import client islands.
- **Do not use React Router imports anywhere.** All routing is Next.js native (`next/link`, `next/navigation`).
- **Do not use `useHead()` or `@unhead/react` anywhere.** All metadata uses Next.js `metadata` exports or `generateMetadata`.
- **Do not use `import.meta.env`** — use `process.env.NEXT_PUBLIC_*` for client-side and `process.env.*` for server-side.
- **Do not create any prerender, sitemap generation, or Puppeteer scripts.** These are handled natively by Next.js.
- **Do not wrap static arrays/objects in `useMemo(() => [...], [])`.** If the data never changes, make it a module-level constant.

### Verification Commands

Run these after each phase (and after individual tasks when noted):

```bash
# Type check — must pass with zero errors
npx tsc --noEmit

# Build — must complete successfully
npm run build

# Dev server — must start without errors
npm run dev

# Lint (if configured)
npm run lint
```

---

## Phase 0: Pre-Flight

**Goal:** Set up the new project, install dependencies, configure tooling. No components yet.

**Entry criteria:** You have access to the old codebase and a clean directory for the new project.

### Task 0.1 — Initialize Next.js Project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Choose these options when prompted:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: `@/*`

### Task 0.2 — Install Dependencies

Install exact dependencies from the CLAUDE.md spec:

```bash
npm install @supabase/supabase-js framer-motion lucide-react react-markdown remark-gfm rehype-sanitize class-variance-authority clsx tailwind-merge tailwindcss-animate
```

Dev dependencies (beyond what create-next-app provides):

```bash
npm install -D @tailwindcss/typography
```

**Verify:** `npm ls --depth=0` shows all packages installed. No `react-router-dom`, no `@unhead/react`, no `puppeteer`, no `express`, no `@emailjs/browser`, no `resend`.

### Task 0.3 — Configure TypeScript

Update `tsconfig.json` paths to match the project:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

### Task 0.4 — Configure Tailwind

Port the Tailwind config from the old `tailwind.config.js`. The new config must include:

- Font families: Poppins (sans), Montserrat
- Custom colors: `ollin-bg` (#f2efe9), `ollin-black` (#111111), `ollin-gray` (#666666)
- Typography plugin

Also port `postcss.config.js` using `@tailwindcss/postcss` and `autoprefixer`.

### Task 0.5 — Port Global Styles

Create `src/styles/globals.css` by combining:

1. The Tailwind imports and `@theme inline` block from the old `index.css`
2. The `secondary-button.css` import
3. The `html, body` base styles
4. The `scrollbar-gutter: stable` rule

Create `src/styles/secondary-button.css` — copy directly from old `styles/secondary-button.css`. This file is pure CSS with no framework dependencies.

**Important:** Port the massive inline `<style>` block from the old `index.html` into a new file `src/styles/hero.css`. This contains:

- CSS custom properties (--bg, --ink, --muted, etc.)
- `.textureOverlay`, `.vignetteOverlay` styles
- `.hero`, `.heroInner`, `.heroLeft`, `.heroRight` styles
- `.bgRingsGroup`, `.bgOrb`, `.bgRing` animations
- `.marqueeTrack`, `.marqueeItem` styles
- `.heroIntro` animation keyframes
- `.btnPrimary`, `.btnSecondary` base styles
- All responsive media queries for the hero

Import this in `globals.css`:

```css
@import "./hero.css";
@import "./secondary-button.css";
```

### Task 0.6 — Set Up Fonts

In the root layout file (don't create the full layout yet — just the font setup):

```tsx
import { Poppins, Montserrat } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
  display: "swap",
});
```

**Do NOT include a `<link>` tag for Google Fonts.** Next.js handles font loading via `next/font`.

### Task 0.7 — Create Utility Files

Port these utility files:

1. **`src/lib/utils.ts`** — Port from old `lib/utils.ts` (the `cn()` function using clsx + tailwind-merge). This is the ONE place for class merging.

2. **`src/lib/supabase/server.ts`** — Create the server-side Supabase client:

   ```tsx
   import { createClient } from "@supabase/supabase-js";

   export function createServerSupabase() {
     return createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     );
   }
   ```

3. **`src/lib/supabase/client.ts`** — Create the browser Supabase client:

   ```tsx
   "use client";
   import { createClient } from "@supabase/supabase-js";

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
   );
   ```

4. **`src/lib/constants/packages.ts`** — Port from old `pages/packages.constants.ts` (PALETTE, LINE, LINE_SOFT).

5. **`src/types/packages.ts`** — Port from old `pages/packages.types.ts`.

6. **`src/types/blog.ts`** — Create blog post type:
   ```tsx
   export type BlogPostRecord = {
     id: string;
     slug: string;
     title: string;
     excerpt: string | null;
     content_md: string | null;
     cover_image_url: string | null;
     tags: string[] | null;
     status: "draft" | "published" | "archived";
     seo_title: string | null;
     seo_description: string | null;
     published_at: string | null;
     updated_at: string;
   };
   ```

### Task 0.8 — Port Hooks

Port all custom hooks to `src/hooks/`:

1. `useDesktopFinePointerLg.ts` — Copy as-is (no framework deps)
2. `useDeviceCapability.ts` — Copy as-is
3. `usePrefersReducedMotion.ts` — Copy as-is
4. `useRevealOnEnter.ts` — Copy as-is

### Task 0.9 — Create `.env.local` Template

Create `.env.example` with the renamed variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_LEADS_GATEWAY_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SITE_URL=https://ollin.agency
```

### Task 0.10 — Copy Static Assets

Copy the entire `public/` directory from the old project:

- `public/media/` (all images and video)
- `public/favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`
- `public/_headers` (Cloudflare headers)

**Do NOT copy** `public/robots.txt` or `public/sitemap.xml` — these will be generated by Next.js.

**✅ Phase 0 Checkpoint:** Run `npm run dev`. The dev server starts. You see the default Next.js page. No errors in terminal. `npx tsc --noEmit` passes.

---

## Phase 1: Layout Shell & Core UI

**Goal:** Build the root layout, navigation, footer, and lead modal. After this phase, every page route will share the same chrome.

### Task 1.1 — Port Simple UI Components

These are dependency-free and needed by the layout:

1. **`src/components/ui/PageLoader.tsx`** — Port from old `components/PageLoader.tsx`. Pure CSS spinner. No `'use client'` needed.

2. **`src/components/ui/StructuredData.tsx`** — Port from old `components/StructuredData.tsx`. Renders a `<script type="application/ld+json">`. No `'use client'` needed.

3. **`src/components/ui/SecondaryButton.tsx`** — Port from old `components/SecondaryButton.tsx`. **Critical change:** Replace `import { Link } from 'react-router-dom'` with `import Link from 'next/link'`. Replace all `to=` props with `href=`. If the component uses `onClick` handlers, the interactive variant needs `'use client'` — split into two: a Link-based server version and a button-based client version, or make the whole thing `'use client'` since it's used in both contexts.

4. **`src/components/effects/BackgroundShape.tsx`** — Port from old `components/BackgroundShape.tsx`. Pure CSS/HTML. No `'use client'` needed.

5. **`src/components/effects/Reveal.tsx`** — Port from old `components/Reveal.tsx`. Uses IntersectionObserver → needs `'use client'`.

### Task 1.2 — Port Lead Modal System

1. **`src/components/lead/LeadModal.tsx`** — Port from old `components/LeadModal.tsx`.
   - Add `'use client'`
   - Replace `useNavigate()` → `useRouter()` from `'next/navigation'`
   - Replace `navigate('/thank-you')` → `router.push('/thank-you')`
   - Replace `import.meta.env.VITE_LEADS_GATEWAY_URL` → `process.env.NEXT_PUBLIC_LEADS_GATEWAY_URL`

2. **`src/components/lead/LeadModalProvider.tsx`** — Port from old `components/LeadModalContext.tsx`.
   - Add `'use client'`
   - Rename file to `LeadModalProvider.tsx` for clarity
   - Keep the Context + Provider pattern

### Task 1.3 — Port Navbar

**`src/components/layout/Navbar.tsx`** — Port from old `components/Navbar.tsx`.

- Add `'use client'`
- Replace `useNavigate()` → `useRouter()` from `'next/navigation'`
- Replace all `navigate(path)` calls → `router.push(path)`
- Remove `window.scrollTo({ top: 0, behavior: 'auto' })` from `handleNavigation` — Next.js handles scroll restoration
- Keep the services-pinned event listener logic (used by ServicesChapters)
- Keep the scroll-hide behavior
- Keep the mobile overlay menu

### Task 1.4 — Port SiteOutro (Footer)

1. **`src/components/effects/SplashCursor.tsx`** — Port from old `components/SplashCursor.tsx`.
   - Add `'use client'`
   - This is 700+ lines of WebGL. Copy the component logic as-is.
   - **Improvement:** Consider extracting the GLSL shader strings into constants at the top of the file for readability, but do not change any shader logic.

2. **`src/components/layout/SiteOutro.tsx`** — Port from old `components/SiteOutro.tsx`.
   - Add `'use client'` (uses `useInView` from Framer Motion)
   - Replace internal links (`href="/privacy"`) with Next.js `<Link href="/privacy">` for legal pages
   - External links (social media) stay as `<a>` tags

### Task 1.5 — Create Conditional Outro Wrapper

**`src/components/layout/ConditionalOutro.tsx`**

```tsx
"use client";
import { usePathname } from "next/navigation";
import SiteOutro from "./SiteOutro";

export default function ConditionalOutro() {
  const path = usePathname();
  if (path === "/contact" || path === "/chat") return null;
  return <SiteOutro />;
}
```

### Task 1.6 — Build Root Layout

**`src/app/layout.tsx`** — This is the most important file in the project.

Structure:

```tsx
// Server Component (NO 'use client')
import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import ConditionalOutro from "@/components/layout/ConditionalOutro";
import LeadModalProvider from "@/components/lead/LeadModalProvider";

// Font setup (from Task 0.6)

export const metadata: Metadata = {
  title: { default: "OLLIN — Design & Systems", template: "%s — OLLIN" },
  description: "More calls and estimates — turned into booked jobs...",
  metadataBase: new URL("https://ollin.agency"),
  // ... full default metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>
        <LeadModalProvider>
          {/* Organization + WebSite JSON-LD */}
          <Navbar />
          <main className="w-full min-h-screen bg-ollin-bg text-ollin-black relative selection:bg-black selection:text-white">
            {children}
          </main>
          <ConditionalOutro />
        </LeadModalProvider>
      </body>
    </html>
  );
}
```

**Key decisions for the layout:**

- The Navbar `theme` prop (light/dark) was route-dependent in the old app. Handle this by making Navbar detect the route internally using `usePathname()`, or pass it via a context/prop from page-level layouts.
- The `bg-[#F2F2F2]` vs `bg-ollin-bg` background switching for the homepage: handle in the homepage page.tsx by wrapping content in a div with the different background, or use a route group `(home)/layout.tsx`.
- The `overflow-x-hidden` class on homepage: apply in homepage page.tsx, not in the root layout.

### Task 1.7 — Create Placeholder Pages

Create minimal page.tsx files for ALL routes so navigation works:

```
src/app/page.tsx                          → "Homepage — Coming Soon"
src/app/chat/page.tsx                     → "AI Chat — Coming Soon"
src/app/services/page.tsx                 → "Services — Coming Soon"
src/app/services/foundation/page.tsx      → "Foundation — Coming Soon"
src/app/services/demand/page.tsx          → "Demand — Coming Soon"
src/app/services/retention/page.tsx       → "Retention — Coming Soon"
src/app/services/audit/page.tsx           → "Audit — Coming Soon"
src/app/packages/page.tsx                 → "Packages — Coming Soon"
src/app/packages/personalized/page.tsx    → "Build Your Plan — Coming Soon"
src/app/blog/page.tsx                     → "Blog — Coming Soon"
src/app/blog/[slug]/page.tsx              → "Blog Post — Coming Soon"
src/app/contact/page.tsx                  → "Contact — Coming Soon"
src/app/privacy/page.tsx                  → "Privacy — Coming Soon"
src/app/terms/page.tsx                    → "Terms — Coming Soon"
src/app/data-deletion/page.tsx            → "Data Deletion — Coming Soon"
src/app/thank-you/page.tsx                → "Thank You — Coming Soon"
src/app/not-found.tsx                     → 404 page
```

Each placeholder should have a proper metadata export with the correct title and description from the old codebase.

**✅ Phase 1 Checkpoint:**

- `npm run build` succeeds
- Dev server shows every route with Navbar + Footer
- Clicking nav links navigates between placeholder pages
- Lead modal opens and closes on every page
- Mobile nav menu works
- SiteOutro is hidden on /contact and /chat
- No console errors

---

## Phase 2: Homepage

**Goal:** Build the complete homepage with all sections. This is the largest single page.

**Approach:** Build each section as an independent component, then assemble in `page.tsx`. Work top-to-bottom (visual order on page).

### Task 2.1 — Hero Section

Port `components/Hero.tsx` → `src/components/home/Hero.tsx`

**Also port** `components/HeroScrollVelocity.tsx` → `src/components/home/HeroScrollVelocity.tsx` (the velocity marquee rows used in the hero).

Both need `'use client'` (Framer Motion, useState, browser APIs).

**Changes:**

- Replace React Router `<Link>` → Next.js `<Link>`
- Replace `to=` → `href=`
- The `BackgroundShape` import path changes
- The `SecondaryButton` import path changes
- The `useLeadModal` import path changes
- The inline `<style>` block in Hero.tsx stays as-is (component-scoped CSS)
- **Improvement:** The `VelocityRow` component is defined inside Hero.tsx. Keep it there (it's tightly coupled) but ensure `useElementWidth` hook is clean.

### Task 2.2 — Reel/Video Section

Port `components/ReelPeekSection.tsx` → `src/components/home/ReelPeekSection.tsx`

- Add `'use client'` (IntersectionObserver, video play/pause)
- No routing changes needed
- **Improvement:** Add a poster frame attribute to the `<video>` tag if a poster image exists in `/media/`. If not, note it as a TODO.

### Task 2.3 — Services Preview Section

Port `components/ServicesPreview.tsx` → `src/components/home/ServicesPreview.tsx`

- Add `'use client'` (animations, state, hover effects)
- Replace `useNavigate()` → `useRouter()`
- Replace React Router `<Link>` → Next.js `<Link>`
- **Improvement:** The `headlines` array and `groups` array are wrapped in `useMemo(() => [...], [])` with empty deps. Extract these to module-level constants.
- The `DecryptedTitleText` sub-component stays inline (it's specific to this section)
- The `RotatingHeadline` sub-component stays inline
- The `BlobCTA` sub-component stays inline

### Task 2.4 — Booking System Section

Port two files:

1. `components/BookingSystemSection.tsx` → `src/components/home/BookingSystemSection.tsx`
2. `components/BookingSystemTrades.tsx` → `src/components/home/BookingSystemTrades.tsx`

**Critical improvement:** **Extract `LiquidImage`** from `BookingSystemTrades.tsx` into its own file:

- `src/components/effects/LiquidImage.tsx` — The WebGL image distortion effect (~200 lines)
- Add `'use client'` to LiquidImage
- Import it in BookingSystemTrades instead of defining inline

Both parent components need `'use client'`.

**Changes:**

- Replace `useNavigate()` → `useRouter()`
- Replace React Router links
- **Improvement:** The `steps` array in BookingSystemSection and `trades` array in BookingSystemTrades are in `useMemo(() => [...], [])`. Extract to module-level constants.

### Task 2.5 — Approach Section

Port `components/ApproachSection.tsx` → `src/components/home/ApproachSection.tsx`

- Add `'use client'` (scroll tracking, state)
- **Improvement:** The `cards` array is in `useMemo`. Extract to module-level constant.
- No routing changes needed

### Task 2.6 — Pricing Section

Port `components/PricingSection.tsx` → `src/components/home/PricingSection.tsx`

- Add `'use client'` (IntersectionObserver, 3D transforms, state, media queries)
- Replace `useNavigate()` → `useRouter()`
- **Improvement:** The `tiles` array is in `useMemo`. Extract to module-level constant.
- Keep the inline `<style>` block (flip tile CSS)

### Task 2.7 — FAQ Section

Port `components/Faq.tsx` → `src/components/home/Faq.tsx`

- Add `'use client'` (accordion state, scroll behavior)
- Replace React Router `<Link>` → Next.js `<Link>`
- **Improvement:** The `faqCategories` array and `faqSchema` are module-level constants / derived data. The `faqCategories` is already a module-level const — good. But `faqSchema` is in `useMemo`. Since it derives from the constant `faqCategories`, make it a module-level constant too.
- The FAQPage JSON-LD structured data should be included. Keep the StructuredData component usage.

### Task 2.8 — Assemble Homepage

Update `src/app/page.tsx`:

```tsx
import type { Metadata } from "next";
// Import all home sections
// Wrap in bg-[#F2F2F2] div (homepage has different bg)

export const metadata: Metadata = {
  title: "OLLIN — Design & Systems for Contractors",
  description: "More calls and estimates for contractors...",
  alternates: { canonical: "https://ollin.agency/" },
  openGraph: {
    /* ... */
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#F2F2F2]">
      <div className="overflow-x-hidden">
        <Hero />
        <ReelPeekSection />
        <ServicesPreview />
        <BookingSystemSection />
        <ApproachSection />
        <PricingSection />
        <Faq />
      </div>
    </div>
  );
}
```

**✅ Phase 2 Checkpoint:**

- Homepage renders fully with all 7 sections
- Hero marquee animates
- Video plays on scroll intersection
- Trade picker switches content + WebGL effect works on desktop
- Flip tiles animate on click
- FAQ accordion opens/closes
- Lead modal triggers from CTAs
- Mobile layout is correct for all sections
- `npm run build` succeeds

---

## Phase 3: Service Pages

**Goal:** Build the Services hub and all 4 sub-pages.

### Task 3.1 — Port Shared Service Components

Port the entire `components/shared/services/` directory to `src/components/services/shared/`:

- `cx.ts` → **Delete.** Replace all usages with `cn()` from `@/lib/utils` OR keep a simple `cx` if tailwind-merge overhead isn't needed for these components. Decide: if these components only concatenate classes without conflicts, a simple `cx` is fine. Create it once in `src/lib/cx.ts` and use everywhere.
- `Card.tsx` — No `'use client'` needed
- `Chip.tsx` — No `'use client'` needed (but uses `<a>` tags — if these should be Next.js Links for internal navigation, update them)
- `Chevron.tsx` — No `'use client'` needed (pure render based on props)
- `Divider.tsx` — No `'use client'` needed
- `Label.tsx` — No `'use client'` needed
- `SectionTitle.tsx` — No `'use client'` needed
- `BulletList.tsx` — Needs `'use client'` (has useState for expand/collapse)
- `StepList.tsx` — No `'use client'` needed
- `ProcessRail.tsx` — Needs `'use client'` (uses useRevealOnEnter hook)
- `index.ts` — Barrel file. Update imports.

### Task 3.2 — Services Hub Page

Port `pages/Services.tsx` + `pages/ServicesHero.tsx` + `components/ServicesChapters.tsx`:

1. **`src/components/services/ServicesHero.tsx`** — Port from `pages/ServicesHero.tsx`. Add `'use client'` (animation state).

2. **`src/components/services/ServicesChapters.tsx`** — Port from `components/ServicesChapters.tsx`. This is the **most complex component** in the codebase (scroll-pinned portal rendering with createPortal).
   - Add `'use client'`
   - Replace React Router `<Link>` → Next.js `<Link>`
   - Keep the portal logic, ResizeObserver, scroll tracking
   - Keep the inline `<style>` block (CTA arrow animation)
   - **Be careful with the `data-services-pinned` attribute and custom event system** — this integrates with Navbar to hide it during the pinned phase

3. **`src/app/services/page.tsx`** — Server Component that imports ServicesHero and ServicesChapters. Add proper metadata.

### Task 3.3 — Foundation Page

Port `pages/ServicesFoundation.tsx` → `src/app/services/foundation/page.tsx`

- This page is mostly static content using the shared service components
- The page.tsx itself can be a Server Component IF all interactive sub-components (BulletList, ProcessRail, Reveal) are already `'use client'`
- Replace `useHead()` → metadata export
- Replace React Router `<Link>` → Next.js `<Link>`
- Remove `useMemo` for `prefersReducedMotion` — use the hook directly or compute once
- Port the inline `<style>` block (foundation hero responsive styles)

### Task 3.4 — Demand Page

Port `pages/ServicesDemand.tsx` → `src/app/services/demand/page.tsx`

Same pattern as Foundation. Replace routing, metadata, extract static data from useMemo.

### Task 3.5 — Retention Page

Port `pages/ServicesRetention.tsx` → `src/app/services/retention/page.tsx`

Same pattern.

### Task 3.6 — Audit Page

Port `pages/ServicesAudit.tsx` → `src/app/services/audit/page.tsx`

Same pattern. Has a custom CTA arrow animation in the inline `<style>` block — keep it.

**✅ Phase 3 Checkpoint:**

- `/services` shows the hero + scroll-pinned chapters
- Scrolling through ServicesChapters transitions between Foundation/Demand/Retention/Audit
- Navbar hides during ServicesChapters pinned phase
- All 4 sub-pages render with correct content
- ProcessRail animations play on scroll
- BulletList expand/collapse works
- All internal links navigate correctly
- `npm run build` succeeds

---

## Phase 4: Packages & Plan Builder

**Goal:** Build the Packages page and the PersonalizedPackage interactive builder.

### Task 4.1 — Port Packages Data

Port `pages/packages.data.ts` → `src/lib/data/packages.ts`

Update imports to reference the new type/constant locations.

### Task 4.2 — Port Package Sub-Components

Port each component to `src/components/packages/`:

1. `PackagesHero.tsx` + `PackagesHeroMobile.tsx` — Add `'use client'` (animation)
2. `PackagesGrid.tsx` + `PackagesGridMobile.tsx` — No `'use client'` needed IF they don't handle click events directly. Check: they receive `onSelect` as a prop. If the parent handles state, these can be server components that render buttons. But since they use dynamic styles based on `activeId`/`anySelected`, they likely need `'use client'`. **Check each component carefully.**
3. `PackageDetailSheet.tsx` — `'use client'` (useLayoutEffect, useRef)
4. `ComparisonSection.tsx` + `ComparisonSectionMobile.tsx` — `'use client'` (drawer state, body scroll lock)
5. `SingleServicesSection.tsx` + `SingleServicesSectionMobile.tsx` — `'use client'` (state, navigation)
6. `CustomPlanCTASection.tsx` — Check if it needs `'use client'` (has onClick handler → yes if used directly)

For each:

- Replace `useNavigate()` → `useRouter()`
- Replace React Router `<Link>` → Next.js `<Link>`

### Task 4.3 — Build Packages Page

**`src/app/packages/page.tsx`**

The old `Packages.tsx` uses `useState`, `useRef`, `useNavigate` — it's heavily interactive. The page.tsx will need to be a thin server wrapper that imports a client PackagesClient component, OR the entire page is `'use client'`.

**Recommended approach:** Create `src/components/packages/PackagesClient.tsx` as `'use client'` containing all the interactive logic from the old `Packages.tsx`. The page.tsx exports metadata and renders PackagesClient.

```tsx
// src/app/packages/page.tsx
import type { Metadata } from "next";
import PackagesClient from "@/components/packages/PackagesClient";

export const metadata: Metadata = {
  /* ... */
};

export default function PackagesPage() {
  return <PackagesClient />;
}
```

### Task 4.4 — Port Personalized Package Builder

This is a complex system with 5 sub-files:

- `PersonalizedPackage.tsx` (main)
- `PersonalizedPackage_Hero.tsx`
- `PersonalizedPackage_Presets.tsx`
- `PersonalizedPackage_Builder.tsx`
- `PersonalizedPackage_FieldControls.tsx`
- `PersonalizedPackage_Modal.tsx`

Port all to `src/components/packages/personalized/`:

All need `'use client'`. Apply standard replacements (routing, env vars, metadata removal).

**`src/app/packages/personalized/page.tsx`** exports metadata and renders the client component.

**✅ Phase 4 Checkpoint:**

- `/packages` renders all 4 tiers with detail expansion
- Comparison drawer opens/closes
- Single services menu works
- `/packages/personalized` renders the full builder
- Preset selection populates services
- Service toggle + field controls work
- Request Quote modal opens and submits
- Mobile layouts work for both pages
- `npm run build` succeeds

---

## Phase 5: Blog (SSR + ISR)

**Goal:** Build the blog with server-side rendering and incremental static regeneration. This is the most important phase for SEO.

### Task 5.1 — Blog Content Component

Create `src/components/blog/BlogContent.tsx` — `'use client'`

This is the ReactMarkdown renderer for blog posts. Port the rendering logic from the old `BlogPost.tsx` (the article section with prose styles, ReactMarkdown with remarkGfm, prev/next navigation).

### Task 5.2 — Blog Index Filter

Create `src/components/blog/BlogFilter.tsx` — `'use client'`

Port the search + tag filter UI from old `BlogIndex.tsx`. This component receives the full post list as a prop (fetched server-side) and filters client-side.

### Task 5.3 — Blog Index Page (SSR)

**`src/app/blog/page.tsx`** — Server Component

```tsx
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import BlogFilter from "@/components/blog/BlogFilter";

export const metadata: Metadata = {
  /* ... */
};

export const revalidate = 3600; // ISR: revalidate every hour

export default async function BlogPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(
      "slug,title,excerpt,content_md,cover_image_url,tags,published_at,seo_description",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return <BlogFilter posts={posts ?? []} />;
}
```

### Task 5.4 — Blog Post Page (SSR + ISR)

**`src/app/blog/[slug]/page.tsx`** — Server Component with generateMetadata

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import BlogContent from "@/components/blog/BlogContent";

export const revalidate = 3600;

export async function generateStaticParams() {
  /* fetch all slugs */
}
export async function generateMetadata({ params }): Promise<Metadata> {
  /* dynamic metadata */
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  // Fetch post + adjacent posts server-side
  // Return <BlogContent post={post} newerPost={newer} olderPost={older} />
  // Or notFound() if post doesn't exist
}
```

**This is critical for SEO.** The blog post HTML must be fully rendered server-side. Verify by viewing page source — you should see the full article content in the HTML, not a loading skeleton.

### Task 5.5 — Blog Layout (Optional)

If the blog pages share a common header ("Blogs" title), create `src/app/blog/layout.tsx`:

```tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen pt-32 pb-20 px-[5vw]">
      <div className="max-w-[1500px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8 text-ollin-black">
          Blogs
        </h1>
        {children}
      </div>
    </div>
  );
}
```

**✅ Phase 5 Checkpoint:**

- `/blog` shows all published posts from Supabase
- Search and tag filter work
- `/blog/[slug]` renders the full post with correct metadata
- **View page source on a blog post — full HTML content is visible** (not client-rendered)
- Prev/next navigation between posts works
- `npm run build` generates static pages for existing blog posts
- New posts in Supabase appear within 1 hour (ISR)

---

## Phase 6: Remaining Pages

**Goal:** Build all remaining pages. These are simpler.

### Task 6.1 — Contact Page

Port `pages/Contact.tsx` → `src/app/contact/page.tsx`

- Remove `useHead()` → metadata export
- No `'use client'` needed (pure static content with links)
- Replace any React Router usage

### Task 6.2 — AI Chat Page

Port `components/AIAssistant.tsx` → `src/components/chat/AIAssistant.tsx`

- Add `'use client'`
- Replace `useNavigate()` → `useRouter()`
- Replace `import.meta.env.VITE_API_BASE_URL` → `process.env.NEXT_PUBLIC_API_BASE_URL`

**`src/app/chat/page.tsx`** exports metadata and renders AIAssistant.

**Note:** The chat page uses `theme='dark'` on Navbar. Handle this by making Navbar detect `/chat` via `usePathname()` internally rather than receiving a prop from the page.

### Task 6.3 — Legal Pages

Port these as simple server components:

- `pages/Privacy.tsx` → `src/app/privacy/page.tsx`
- `pages/Terms.tsx` → `src/app/terms/page.tsx`
- `pages/DataDeletion.tsx` → `src/app/data-deletion/page.tsx`

For each:

- Remove `useHead()` → metadata export
- Remove `useEffect(() => { window.scrollTo(0, 0) }, [])` — unnecessary in Next.js
- No `'use client'` needed (static content)

### Task 6.4 — Thank You Page

Port `pages/ThankYou.tsx` → `src/app/thank-you/page.tsx`

- Remove `useHead()` → metadata export (with `robots: { index: false }`)
- Replace React Router `<Link>` → Next.js `<Link>`
- Keep the conversion tracking `useEffect` — this needs `'use client'`. Wrap the tracking logic in a client component, or make the page `'use client'`.

### Task 6.5 — 404 Page

Port `pages/NotFound.tsx` → `src/app/not-found.tsx`

- Replace React Router `<Link>` → Next.js `<Link>`
- No metadata needed (Next.js handles 404 metadata)

**✅ Phase 6 Checkpoint:**

- All 16 routes render correctly
- Contact page shows email/phone/WhatsApp/SMS links
- AI chat connects to the API and responds
- Legal pages display content
- Thank You page loads (test by visiting directly)
- 404 page shows for invalid routes
- `npm run build` succeeds with all pages

---

## Phase 7: SEO Infrastructure

**Goal:** Add the final SEO pieces that make the site discoverable.

### Task 7.1 — Dynamic Sitemap

Create `src/app/sitemap.ts` following the spec in CLAUDE.md. Must include all static routes + dynamic blog slugs fetched from Supabase.

### Task 7.2 — Robots.txt

Create `src/app/robots.ts` following the spec in CLAUDE.md.

### Task 7.3 — JSON-LD Structured Data

Ensure the root layout includes Organization + WebSite JSON-LD. Ensure the homepage includes FAQPage JSON-LD. Ensure blog posts include BlogPosting JSON-LD (in generateMetadata or as a script tag in the page).

### Task 7.4 — Open Graph & Twitter Cards

Verify every page has:

- `og:title`, `og:description`, `og:type`, `og:url`
- `twitter:card`, `twitter:title`, `twitter:description`
- Blog posts with images: `og:image`, `twitter:image`
- Canonical URL via `alternates.canonical`

### Task 7.5 — Metadata Template

Ensure the root layout uses a title template:

```tsx
title: {
  default: 'OLLIN — Design & Systems',
  template: '%s — OLLIN',
}
```

So sub-pages can export `title: 'Services & Systems'` and it becomes "Services & Systems — OLLIN".

**✅ Phase 7 Checkpoint:**

- `/sitemap.xml` returns a valid XML sitemap with all routes
- `/robots.txt` returns correct content
- View source on homepage — JSON-LD blocks are present
- View source on a blog post — BlogPosting JSON-LD is present
- Check OG tags with a debugger tool (or view source)

---

## Phase 8: Cleanup & Polish

**Goal:** Remove dead code, fix remaining issues, optimize.

### Task 8.1 — Remove Dead Code

Verify these are NOT in the new project:

- No `netlify.toml`
- No `netlify/functions/` directory
- No `generate-sitemap.js`
- No `prerender.mjs`
- No `utils/email.ts`
- No `metadata.json`
- No `components.json` (shadcn config — only keep if actively using shadcn)

### Task 8.2 — Clean .gitignore

Create a clean `.gitignore`:

```
node_modules/
.next/
out/
.env
.env.*
!.env.example
.DS_Store
*.tsbuildinfo
```

### Task 8.3 — Audit `'use client'` Directives

Review every component. Remove `'use client'` from any component that doesn't actually need it. A component needs `'use client'` ONLY if it:

- Uses React hooks (useState, useEffect, useRef, etc.)
- Uses browser APIs (IntersectionObserver, ResizeObserver, WebGL, etc.)
- Uses event handlers (onClick, onChange, etc.) directly
- Imports from `'next/navigation'` (useRouter, usePathname, etc.)
- Uses Framer Motion components (motion.div, useScroll, etc.)

### Task 8.4 — Performance Check

- Run `npm run build` and check the build output for page sizes
- Ensure no unexpectedly large client bundles
- Verify dynamic imports work where appropriate (the old codebase used `lazy()` for pages — in Next.js, the App Router handles code splitting automatically per route)

### Task 8.5 — Console Error Sweep

Run `npm run dev`, visit every route, check browser console for:

- Hydration mismatches
- Missing environment variables
- Failed API calls
- Deprecated API warnings
- React key warnings

Fix all errors.

**✅ Phase 8 Checkpoint:**

- `npm run build` succeeds with no warnings
- All routes work in production mode (`npm run start`)
- No console errors on any page
- View source on any page shows full SSR HTML content
- Bundle sizes are reasonable

---

## Phase 9: Deployment Prep

**Goal:** Configure for production deployment.

### Task 9.1 — next.config.ts

Create the production config:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add any external domains for blog cover images
    remotePatterns: [],
  },
  // Headers are handled by Cloudflare (_headers file) or Vercel config
};

export default nextConfig;
```

### Task 9.2 — Environment Variables

Document all required env vars. Create `.env.example` with descriptions.

### Task 9.3 — GitHub Actions (if needed)

If deploying to Cloudflare Pages, create `.github/workflows/deploy.yml` for the Next.js build. If deploying to Vercel, no CI config needed (auto-deploys from GitHub).

**✅ Phase 9 Checkpoint:**

- Production build completes
- All env vars are documented
- Deployment target is configured
- Ready for DNS cutover

---

## Final Verification

Before considering the migration complete, run through this checklist:

```
[ ] All 16 routes render with correct content
[ ] view-source: on homepage shows full HTML (not empty shell)
[ ] view-source: on blog post shows full article HTML
[ ] /sitemap.xml includes all routes + blog posts
[ ] /robots.txt is correct
[ ] Lead modal works on all pages
[ ] AI chat connects and responds
[ ] WebGL effects render on desktop (SplashCursor, LiquidImage)
[ ] Mobile navigation works
[ ] Framer Motion animations play
[ ] ServicesChapters scroll-pinning works
[ ] PricingSection flip tiles work
[ ] PersonalizedPackage builder submits
[ ] Blog search and tag filter work
[ ] No console errors on any page
[ ] npm run build succeeds
[ ] Production mode (npm start) works
```
