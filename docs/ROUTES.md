# Routes — Ahana V3 (Batch 1)

## Public routes

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | Page | Landing page. Adapts header and call to action to session state. |
| `/resources` | Page | Placeholder for brochures, publications, research, videos. |
| `/privacy` | Page | Privacy notice placeholder — linked from the registration consent. |
| `/terms` | Page | Terms of use placeholder — linked from the registration consent. |
| `/auth/check-email` | Page | Post-registration and post-reset confirmation screen. |
| `/auth/forgot-password` | Page | Request a password reset link. |
| `/auth/auth-code-error` | Page | Shown when a confirmation or recovery link fails. `noindex`. |
| `/auth/confirm` | Route handler (GET) | Verifies `token_hash` + `type`, then forwards. |

## Guest-only routes

Authenticated visitors are redirected to `/dashboard`.

| Route | Purpose |
| --- | --- |
| `/auth/login` | Sign in. Accepts `?next=` and `?status=`. |
| `/auth/register` | Create an account. |

## Protected routes

Unauthenticated visitors are redirected to `/auth/login?next=<original-path>`.

| Route | Purpose |
| --- | --- |
| `/dashboard` | Welcome, account summary, quick links, clinical boundary, sign out. |
| `/profile` | Read-only account details. |
| `/library` | Placeholder for saved resources. |

## Session routes

| Route | Method | Behaviour |
| --- | --- | --- |
| `/auth/signout` | POST | Signs out, `303` to `/auth/login?status=signed-out`. |
| `/auth/signout` | GET | Redirects to `/auth/login`. Does **not** sign out. |

## Query parameters

| Parameter | Route | Notes |
| --- | --- | --- |
| `next` | `/auth/login`, `/auth/confirm` | Same-origin path only, gated by `safeNextPath()`. |
| `status` | `/auth/login` | `password-updated`, `signed-out`, `session-expired`. |
| `status` | `/auth/forgot-password` | `link-expired`. |
| `email` | `/auth/check-email` | Display only; never used for a lookup. |
| `mode` | `/auth/check-email` | `reset` switches the copy to the recovery variant. |
| `token_hash`, `type` | `/auth/confirm` | Supplied by Supabase. `type` is allowlisted. |

## Redirect map

```
Register success            → /auth/check-email?email=…
Confirm success (signup)    → /dashboard
Confirm success (recovery)  → /auth/reset-password
Confirm failure             → /auth/auth-code-error
Login success               → ?next= or /dashboard
Forgot password submit      → /auth/check-email?mode=reset&email=…
Reset password success      → /auth/login?status=password-updated
Sign out (POST)             → /auth/login?status=signed-out
Protected + no session      → /auth/login?next=<path>
Guest-only + session        → /dashboard
Reset page + no session     → /auth/forgot-password?status=link-expired
```

## Proxy matcher

`proxy.ts` runs on every request except `_next/static`, `_next/image`,
`favicon.ico`, and files ending in `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`,
`.webp`.

## Build output

All routes except `/auth/auth-code-error` and `/_not-found` are server-rendered
on demand, because they read cookies or search params.
