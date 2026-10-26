# Frontend (Next.js) — Claude rules

This is the MitchDesigns frontend. Independent git repo. Deploys to Cloudflare Pages/Workers via OpenNext. Backend lives at `../backend/` (separate repo).

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4 (`@theme` tokens in `src/app/globals.css`)
- Framer Motion
- TypeScript strict
- pnpm
- OpenNext → Cloudflare

## Data layer

Content comes from Strapi via `src/lib/cms/`:

- `strapi.ts` — server-only fetch client (`getCollection`, `getSingle`)
- `queries.ts` — typed query functions, used from RSC pages
- `media.ts` — pure URL helper for media (safe in client components)
- `types.ts` — mirrors Strapi schemas in `../backend/src/api/*/content-types/`
- `fixtures.ts` — fallback data when Strapi is unreachable

Env (`.env.local`):
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<read-only token from Strapi admin>
```

When you change a field in Strapi schema, update the matching type in `src/lib/cms/types.ts`. The repos are independent but the API surface is the contract.

## Coding rules — must follow

- **Server-only modules** never live in client-reachable barrels. Pure helpers (e.g. `strapiMedia`) live in their own leaf module so `"use client"` files can import without dragging `import "server-only"` in transitively.
- Every page and block component renders inside the `<Section>` wrapper (or a container that applies the standard horizontal padding). Never output to the viewport edge.
- No fixed `width`/`height` on cards or components. Use `flex`, `aspect-ratio`, `min-h`, %, `vw`/`vh`. Fixed pixels are only acceptable for icons, avatars, single-pixel decorative bits.
- No `cursor-pointer` on buttons or links — leave the cursor at the browser default.
- Every `<p>` gets `text-balance` to prevent orphans on the last line.
- No inline SVG icon functions. Icons live in `src/components/icons/` as individual files.
- No arbitrary Tailwind values like `[60px]` or `[#373737]`. Custom spacing/colors/radii/font sizes are tokens in `@theme` (`src/app/globals.css`) and referenced by name (`px-section`, `bg-card`, `text-fg-muted`). If a token doesn't exist, add it to the config first.
- Block components are pure/presentational — typed props, zero fetch logic. Data fetching lives in server components or dedicated `*Fetcher` server components that call `src/lib/cms/queries.ts`. Fixture fallbacks belong inside the query function, not the component.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next dev (turbopack) |
| `pnpm build` | Next build |
| `pnpm preview` | OpenNext build + local preview on Workers runtime |
| `pnpm deploy` | OpenNext build + deploy to Cloudflare |
| `pnpm typecheck` | tsc --noEmit |
| `pnpm lint` | next lint |
