# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build — the primary correctness gate
npm run lint    # bare `eslint` (flat config, eslint-config-next)
```

No test runner is configured. Verification for this project means `npm run lint` + `npm run build` plus manual browser testing of the auth routes.

Do not run `npm audit fix --force`.

## Repository layout

The git root is the **parent** directory (`Ahana_Cloudflare_V3_1/`), which holds the legacy framework-free Cloudflare Pages site (`index.html`, `login/`, `dashboard/`, `assets/js/supabase-config.js`, `supabase/schema.sql`). That legacy site documents itself as explicitly *not* Next.js — its `SUPABASE-CONNECTION.md` and `.env.local.example` describe the old static app and do not govern this directory.

`ahana-v3-next/` is the Next.js 16 App Router rewrite and is the primary working directory. Assume work happens here unless told otherwise. `supabase/schema.sql` in the parent is the shared Supabase project schema.

## Architecture

### Supabase session model (three clients, one per execution context)

`utils/supabase/` contains three factories that must not be interchanged:

- `client.ts` — `createBrowserClient`, for Client Components only.
- `server.ts` — `createServerClient` over `await cookies()`. Its `setAll` is wrapped in try/catch because Server Components cannot write cookies; session refresh is delegated to the proxy. **Every server file must `await createClient()`** — the factory is async.
- `middleware.ts` — `updateSession()`, the only place that reliably refreshes the auth cookie.

`updateSession` rebuilds its `NextResponse` inside `setAll` and returns it. If you add redirect logic there, copy cookies onto the redirect response (`response.cookies.getAll().forEach(c => redirect.cookies.set(c))`) or users get logged out on every guarded navigation.

### Next.js 16 specifics that break copied-from-docs code

- Middleware lives in **`proxy.ts` at the project root and exports `proxy`**, not `middleware.ts`/`middleware`. Most Supabase + Next.js tutorials use the old name.
- `cookies()`, `headers()`, `params`, and `searchParams` are all async — page props type `searchParams` as a `Promise` and `await` it.

### Environment variables

Only two, both public, in `.env.local` (git-ignored via `.env*`):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Note the key is named `PUBLISHABLE_KEY`, not the `ANON_KEY` used in most Supabase examples. A service-role key must never be added to this project.

### Design system

CSS-based, not utility-first, despite Tailwind v4 being installed from the create-next-app scaffold. `styles/tokens.css` holds the approved Ahana brand palette as CSS custom properties (`--ahana-purple: #4C2E83`, etc.) — these values are design-approved and must not be extended with ad-hoc colours. `styles/base.css` holds element defaults and a small set of `.ahana-*` helpers. Component styling belongs in co-located CSS Modules under `components/`. Prefer these over inline `style` objects and over new Tailwind classes.

### Validation and auth conventions

`lib/validation/auth.ts` is the single server-side validation layer; client-side `required`/`minLength` attributes are convenience only and are never trusted. Two conventions matter:

- Emails are normalized to lowercase (`normalizeEmail`) before reaching Supabase, so identity matching is consistent.
- `preferredLanguage` and `accountType` go through `coerce*` allowlist functions rather than being rejected on mismatch. `coerceAccountType` is the control preventing a crafted request from writing `staff`/`admin` into user metadata.

Auth server actions return a `FormState` (`message`, `fieldErrors`, echoed-back `values` that exclude passwords) for `useActionState`, and call `redirect()` on success.

Authorization decisions use `supabase.auth.getUser()` server-side only — never `getSession()` and never client-held state.

## Product constraints

- **No clinical data.** This release stores no medical records, diagnoses, prescriptions, or treatment history. Do not add clinical profile fields or medical schema.
- **Account type is informational only.** It grants no privileges, and users cannot self-assign staff or admin roles.
- Never log passwords, tokens, or full Supabase auth responses. Surface generic messages to users rather than raw Supabase error text.
