# Authentication — Ahana V3 (Batch 1)

Every flow below runs server-side. The browser never holds a Supabase service
key, and no authorisation decision depends on client state.

## Registration

**Route:** `/auth/register` → `app/auth/register/actions.ts`

1. `validateRegistration()` checks all seven fields server-side.
2. Email is normalised to lowercase.
3. `preferredLanguage` and `accountType` are coerced onto allowlists.
4. `supabase.auth.signUp()` is called with:
   - `emailRedirectTo` → `/auth/confirm?next=/dashboard`
   - `data` → `full_name`, `preferred_language`, `account_type`
5. Success redirects to `/auth/check-email?email=…`.

The response is identical whether or not the address already has an account.
Supabase returns an obfuscated user for existing addresses when email
confirmation is enabled, and the action does not branch on it, so the form
cannot be used to enumerate registered addresses.

## Email confirmation

**Route:** `GET /auth/confirm` → `app/auth/confirm/route.ts`

Accepts `token_hash`, `type` and an optional `next`.

- `type` is checked against an allowlist of `EmailOtpType` values before it
  reaches `verifyOtp`.
- `next` passes through `safeNextPath()` (see below) and defaults to
  `/dashboard`.
- Session cookies are written onto the redirect response directly.
- Any failure redirects to `/auth/auth-code-error`.

The same handler serves recovery links, which arrive with
`next=/auth/reset-password`.

## Login

**Route:** `/auth/login` → `app/auth/login/actions.ts`

`signInWithPassword()`. Success redirects to the validated `next` path, or
`/dashboard`. Failure returns "The email address or password is incorrect."
regardless of whether the address exists.

`/auth/login?status=…` renders a success banner for `password-updated`,
`signed-out` and `session-expired`.

## Forgot password

**Route:** `/auth/forgot-password` → `app/auth/forgot-password/actions.ts`

`resetPasswordForEmail()` with `redirectTo` →
`/auth/confirm?next=/auth/reset-password`.

The user is redirected to `/auth/check-email?mode=reset` whether or not the
address is registered. Only HTTP 429 (rate limiting) surfaces an error, because
silently swallowing it would leave the user waiting for an email that was never
sent.

## Reset password

**Route:** `/auth/reset-password` → `app/auth/reset-password/actions.ts`

1. The page calls `requireRecoverySession()`; without a session the visitor is
   sent to `/auth/forgot-password?status=link-expired`.
2. The action re-verifies the session with `getUser()` on submit — the page
   guard alone is not trusted.
3. Password must be at least 8 characters and match the confirmation.
4. `updateUser({ password })`, then `signOut()`.
5. Redirects to `/auth/login?status=password-updated`.

Signing out afterwards is intentional: it invalidates the one-time recovery
session and forces a fresh sign-in with the new password.

## Logout

**Route:** `POST /auth/signout` → `app/auth/signout/route.ts`

POST only, submitted by a form in the header and on the dashboard. A GET
sign-out could be triggered by a prefetch, an `<img>` tag on another site, or a
link in an email, so `GET /auth/signout` simply redirects to the login page
without touching the session.

The redirect uses **303 See Other** so the browser follows it with a GET rather
than re-POSTing.

## Route protection

Two layers, both server-side:

**Layer 1 — `proxy.ts` / `utils/supabase/middleware.ts`**

- Unauthenticated request to `/dashboard`, `/profile`, `/library` (or any
  sub-path) → `307` to `/auth/login?next=<original-path-and-query>`.
- Authenticated request to `/auth/login` or `/auth/register` → `307` to
  `/dashboard`.
- Refreshed auth cookies are copied onto the redirect response by
  `withCookies()`. Omitting that step signs the user out on every guarded
  navigation.

**Layer 2 — `lib/auth/guards.ts`**

`requireUser()`, `requireRecoverySession()` and `redirectIfAuthenticated()` are
called inside the pages themselves.

All guards use `supabase.auth.getUser()`, which validates the token with the
Auth server. `getSession()` is never used for an authorisation decision because
it only decodes the local cookie, which a client can forge.

## Open-redirect protection

`lib/auth/redirects.ts` gates every user-supplied `next` value. `safeNextPath()`
accepts only same-origin absolute paths and rejects:

- absolute URLs (`https://evil.example`)
- protocol-relative paths (`//evil.example`)
- backslash variants (`/\evil.example`) that some browsers normalise to `//`
- control characters

Verified: `GET /auth/login?next=https://evil.example` renders no hidden `next`
field, so the login action falls back to `/dashboard`.

## Error handling

`lib/auth/errors.ts` maps Supabase error codes onto approved copy.
`error.message` is never rendered and never logged. `logAuthFailure()` writes a
single line containing only the error code and HTTP status, and is a no-op in
production.

## Supabase dashboard configuration

Required before the flows work end to end:

1. **Authentication → URL Configuration → Site URL** — set to the deployed
   origin.
2. **Redirect URLs** — add `<origin>/auth/confirm` for production and every
   preview domain.
3. **Authentication → Providers → Email** — enable email/password signup and
   email confirmation.
4. **Email templates** — the confirmation and recovery templates must use
   `{{ .TokenHash }}` and point at `/auth/confirm`, not the legacy
   `{{ .ConfirmationURL }}` implicit-flow format. Without this the confirm
   handler receives no `token_hash` and redirects to the error page.
