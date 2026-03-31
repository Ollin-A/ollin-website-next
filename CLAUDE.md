# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for **OLLIN Agency** (ollin.agency) — a contractor marketing agency targeting U.S. home service contractors. Migrating from a Vite + React Router SPA to **Next.js 15 App Router** for SSR/SSG and SEO.

**Source Vite project:** `../ollin-website/`
**Migration execution guide:** `prompt.md` (read this for phase-by-phase instructions)

## Commands

```bash
npm run dev        # Next.js dev server (port 3000)
npm run build      # Production build — must pass before any phase is complete
npm run start      # Start production server
npm run lint       # ESLint
npx tsc --noEmit   # Type check — run after every file change
```

## Architecture

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion 12 · Supabase (blog) · Cloudflare Pages or Vercel

**Directory layout** (uses `src/` directory with `@/*` import alias):
```
src/app/              — App Router pages and layouts
src/components/       — ui/, layout/, lead/, effects/, sections by feature
src/hooks/            — Custom React hooks (useDeviceCapability, useRevealOnEnter, etc.)
src/lib/              — Utilities (utils.ts with cn()), supabase clients, constants
src/styles/           — globals.css, hero.css, secondary-button.css
src/types/            — TypeScript type definitions (blog, packages)
```

### Server vs Client Components

Default to **Server Components**. Add `'use client'` ONLY when the component uses:

- React hooks (`useState`, `useEffect`, `useRef`, `useLayoutEffect`)
- Browser APIs (`IntersectionObserver`, `ResizeObserver`, WebGL, Canvas)
- Framer Motion (`motion.*`, `useScroll`, `useTransform`, `useInView`)
- Next.js client hooks (`useRouter`, `usePathname`, `useSearchParams`)
- Event handlers directly (`onClick`, `onChange`)

Do NOT add `'use client'` to `page.tsx` files — pages should be Server Components that import client islands.

### Heavy Client Components (preserved from Vite project)

- `SplashCursor.tsx` — WebGL fluid simulation (~700 lines)
- `LiquidImage.tsx` — WebGL image distortion (extract from BookingSystemTrades)
- `ServicesChapters.tsx` — Scroll-pinned portal with `createPortal`
- `PricingSection.tsx` — 3D CSS flip tiles
- `PersonalizedPackage*.tsx` — Interactive plan builder system
- `AIAssistant.tsx` — Chat interface

### Supabase

- **Server client** (`lib/supabase/server.ts`): For Server Components, `generateMetadata`, `generateStaticParams`
- **Browser client** (`lib/supabase/client.ts`): For `'use client'` components
- Blog uses ISR: `export const revalidate = 3600`

## Migration Workflow

1. **Complete one phase fully before starting the next.** Each phase in `prompt.md` has a verification step — do not skip it.
2. **Within a phase, complete tasks in listed order.** Dependencies flow top-to-bottom.
3. **When porting from the old codebase**, do not copy-paste blindly. Apply all improvements listed in the task. The migration IS the refactor.
4. **Keep every commit atomic.** One task = one logical commit. Never leave the project in a broken state between tasks.
5. **Do not install dependencies that aren't in the spec.** Check the dependency list in `prompt.md` Task 0.2 first.
6. **Do not create barrel files (index.ts)** unless the original codebase had them AND they serve a clear purpose.

## Coding Rules

1. **Routing:** `import Link from 'next/link'` with `href=` — never React Router
2. **Navigation:** `import { useRouter, usePathname } from 'next/navigation'` — never `useNavigate`
3. **Metadata:** Export `metadata` or `generateMetadata` from every `page.tsx` — never `useHead()`
4. **Classes:** Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) — consolidate all `cx()` copies
5. **Env vars:** `NEXT_PUBLIC_*` for client, `process.env.*` for server — never `import.meta.env`
6. **Images:** Use `next/image` for all images except WebGL textures (need raw `<img>` for canvas)
7. **Fonts:** `next/font/google` (Poppins 300-600, Montserrat 600) — no CDN `<link>` tags
8. **Static data:** Module-level constants — never `useMemo(() => [...], [])` with empty deps
9. **URLs:** Keep identical route structure to current site — no route changes
10. **Scroll:** Remove all `window.scrollTo(0, 0)` on mount — Next.js handles scroll restoration

## Environment Variables

| Old (Vite)               | New (Next.js)                   |
| ------------------------ | ------------------------------- |
| `VITE_SUPABASE_URL`      | `NEXT_PUBLIC_SUPABASE_URL`      |
| `VITE_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `VITE_LEADS_GATEWAY_URL` | `NEXT_PUBLIC_LEADS_GATEWAY_URL` |
| `VITE_API_BASE_URL`      | `NEXT_PUBLIC_API_BASE_URL`      |
| `VITE_SITE_URL`          | `NEXT_PUBLIC_SITE_URL`          |

## Tailwind Custom Values

```
Colors:  ollin-bg (#f2efe9) · ollin-black (#111111) · ollin-gray (#666666)
Fonts:   sans -> Poppins · montserrat -> Montserrat
```

## Dead Code — Do NOT Port

- `netlify.toml` + `netlify/functions/` — deploy target is Cloudflare/Vercel
- `generate-sitemap.js` — replaced by `app/sitemap.ts`
- `prerender.mjs` — SSR eliminates prerendering
- `utils/email.ts` — EmailJS unused, leads go through gateway
- `metadata.json` — not needed in Next.js
- Tailwind CDN `<script>` in index.html — PostCSS handles this
