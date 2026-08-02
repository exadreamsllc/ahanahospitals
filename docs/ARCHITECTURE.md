# Architecture — Ahana V3 (Batch 1)

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript, `strict: true` |
| Auth | Supabase Auth via `@supabase/supabase-js` and `@supabase/ssr` |
| Session refresh | `proxy.ts` at the project root |
| Styling | CSS custom properties + CSS Modules |
| Runtime | Node.js server rendering (all auth routes are dynamic) |

Tailwind v4 remains installed from the `create-next-app` scaffold and is still
imported by `app/globals.css`, but the Ahana design system does not depend on
it. New styling should use the tokens and CSS Modules described below.

## Directory layout

```
app/                      Routes (App Router)
  auth/                   register, login, check-email, confirm, forgot-password,
                          reset-password, signout, auth-code-error
  dashboard/  profile/  library/     Protected member routes
  resources/  privacy/  terms/       Public content routes
  layout.tsx              Root layout, global metadata, viewport/theme colour
  globals.css             Design system entry point

components/
  ui/                     FormField, SelectField, CheckboxField, AlertMessage,
                          PrimaryButton, LoadingButton, SecondaryLink
  layout/                 AppHeader, AppFooter, MemberShell
  auth/                   AuthShell, AuthCard, and the four client forms

lib/
  auth/                   guards, errors, redirects, user metadata, origin
  validation/             server-side form validation
  constants/              routes, nav, allowlists, brand copy

styles/                   tokens.css (brand palette), base.css (element defaults)
utils/supabase/           client.ts, server.ts, middleware.ts
docs/                     this documentation set
```

## The three Supabase clients

Each execution context needs a differently wired client. They are not
interchangeable.

| File | Used by | Notes |
| --- | --- | --- |
| `utils/supabase/client.ts` | Client Components | `createBrowserClient`. Not currently used by any Batch 1 screen — all auth runs server-side. |
| `utils/supabase/server.ts` | Server Components, Server Actions | Wraps `await cookies()`. `setAll` is inside a try/catch because Server Components cannot write cookies; the proxy handles refresh instead. The factory is **async** — always `await createClient()`. |
| `utils/supabase/middleware.ts` | `proxy.ts` | Rebuilds its `NextResponse` inside `setAll` so refreshed cookies survive. |

Two route handlers (`/auth/confirm`, `/auth/signout`) build their own
`createServerClient` bound directly to the redirect response they return. This
is deliberate: both need `Set-Cookie` headers attached to a redirect, and
binding the client to that exact response makes the cookie write explicit
rather than relying on framework-level cookie propagation.

## Request lifecycle

1. `proxy.ts` matches every request except static assets and images.
2. `updateSession()` refreshes the Supabase session and calls
   `supabase.auth.getUser()`, which validates the token against the Auth server.
3. Coarse access control runs in the proxy: unauthenticated users on protected
   prefixes are redirected to login; authenticated users on login/register are
   redirected to the dashboard.
4. The page renders and repeats the check with `requireUser()` /
   `redirectIfAuthenticated()` from `lib/auth/guards.ts`.

Step 4 is not redundant defence theatre — it means a change to the proxy
matcher cannot silently expose a member page.

## Form submission model

Auth forms are client components using React's `useActionState`. The server
action signature is:

```ts
(prevState: FormState, formData: FormData) => Promise<FormState>
```

- Validation runs server-side in `lib/validation/auth.ts`. HTML attributes
  (`required`, `minLength`, `type="email"`) are a fast first pass only.
- On failure the action returns a `FormState` holding a form-level message,
  per-field errors, and the values safe to echo back. Passwords are never
  echoed.
- On success the action calls `redirect()`, which throws `NEXT_REDIRECT` and is
  handled by the framework.
- `LoadingButton` reads `useFormStatus()` and disables itself while the action
  is in flight, which also prevents double submission.

## Design system

`styles/tokens.css` holds the approved brand palette and the spacing, radius,
typography and elevation scales as CSS custom properties. `styles/base.css`
holds element defaults, the focus-ring treatment, the skip-link, and a small
set of `.ahana-*` layout helpers.

Component styling lives in co-located CSS Modules. The registration page, which
previously carried a large inline style object, now renders entirely through
these components.

Accessibility choices baked into the components:

- Every input has a real `<label>`; no placeholder-only fields.
- Errors are wired through `aria-describedby` and `aria-invalid`, and are
  conveyed by text, not colour alone.
- `AlertMessage` uses `role="alert"` for errors and `role="status"` otherwise.
- A visible-on-focus skip link starts every page frame.
- Focus rings are a double ring (white + orange) so they show on both light and
  purple backgrounds.
- Buttons and nav links have a 44–48px minimum touch target.
- `prefers-reduced-motion` disables the pending spinner animation.

## Clinical-data boundary

No clinical data is stored, requested, or modelled in this release. User
metadata is limited to `full_name`, `preferred_language` and `account_type`.
The boundary statement is rendered in the footer of every page and repeated on
the dashboard, profile and library. See `SECURITY.md`.
