# Security — Ahana V3 (Batch 1)

## Secrets and keys

Two environment variables, both public by design, in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Optional, recommended in production:

```
NEXT_PUBLIC_SITE_URL      # canonical origin used to build email redirect links
```

Without `NEXT_PUBLIC_SITE_URL`, `lib/auth/origin.ts` derives the origin from
`x-forwarded-host` / `host`. That is correct for local development, but in
production it means a spoofed `Host` header could influence the link in a
confirmation email. Set the variable on any deployed environment.

**No service-role key is used, requested, or supported in this project.** The
publishable key is safe to ship to the browser; it is constrained by Supabase
Row Level Security. A service-role key bypasses RLS entirely and must never
appear in a Next.js app, in `NEXT_PUBLIC_*`, or in this repository.

`.env*` is git-ignored (`.gitignore`). Verify with `git check-ignore .env.local`
before any commit.

## Session model

Supabase `@supabase/ssr` stores the session in HTTP-only cookies, which are
refreshed by `proxy.ts` on every matched request. Cookie attributes (name,
`HttpOnly`, `SameSite`, `Secure`, chunking) are managed by `@supabase/ssr`; the
application does not set them by hand.

Authorisation always uses `supabase.auth.getUser()`, which validates the JWT
with the Auth server. `getSession()` only decodes the local cookie and is never
used to decide access.

## Controls implemented

| Risk | Control |
| --- | --- |
| Privilege escalation via registration metadata | `coerceAccountType()` restricts `account_type` to a four-value allowlist. Staff and admin values do not exist. Account type grants no privileges in Batch 1. |
| Account enumeration on signup | Identical response and redirect whether or not the address is registered. |
| Account enumeration on password reset | Identical redirect for known and unknown addresses; only HTTP 429 surfaces an error. |
| Account enumeration on login | Single generic message for all credential failures. |
| Open redirect | `safeNextPath()` accepts only same-origin absolute paths; rejects absolute URLs, `//host`, `/\host`, and control characters. |
| CSRF sign-out | Sign-out is POST-only; `GET /auth/signout` redirects without ending the session. |
| Double submission | `LoadingButton` disables the submit control via `useFormStatus()`. |
| Leaking provider internals | `toSafeAuthMessage()` maps error codes to approved copy; raw `error.message` is never rendered. |
| Credential leakage in logs | Passwords, tokens and full auth responses are never logged. `logAuthFailure()` logs only an error code and status, and is disabled in production. |
| Stale recovery session | `signOut()` after a successful password update invalidates the one-time recovery session. |
| Unvalidated OTP type | `/auth/confirm` checks `type` against an allowlist before calling `verifyOtp`. |
| Client-trusted auth state | No route relies on client state. Both the proxy and the page call `getUser()`. |

## Input validation

All validation is server-side in `lib/validation/auth.ts`. Client-side HTML
constraints are a convenience for users, not a control.

- Email: trimmed, lowercased, shape-checked, capped at 254 characters.
- Password: 8–72 characters (72 is the bcrypt input ceiling Supabase uses).
- Full name: capped at 120 characters.
- Language and account type: allowlist coercion, unknown values fall back to
  the default rather than erroring.
- Terms acceptance: must be present.

## Clinical-data boundary

This release stores **no** clinical or medical information. Specifically absent:
diagnoses, prescriptions, treatment history, appointment records, clinical
notes, referrals, and any free-text field that could invite them.

Stored user metadata is exactly three fields: `full_name`,
`preferred_language`, `account_type`.

The boundary is stated to users in the footer of every page and repeated on the
dashboard, profile, library, privacy and terms pages.

Any future batch that introduces clinical data requires a separate data
protection review, an explicit consent model, and RLS policies written for it —
it is not an incremental change to this codebase.

## Security headers

Configured in `next.config.ts` and applied to every route via `source: "/:path*"`,
including route handlers and static assets. Verified against `next start`.

| Header | Value | Purpose |
| --- | --- | --- |
| `Content-Security-Policy` | see below | Restricts where scripts, styles, and connections may come from |
| `Strict-Transport-Security` | `max-age=31536000` | Forces HTTPS for a year. **Production only** — omitted in development where it would be meaningless |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME sniffing |
| `X-Frame-Options` | `DENY` | Legacy clickjacking defence, paired with `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Keeps confirmation and reset tokens out of third-party referrer logs |
| `Permissions-Policy` | camera, microphone, geolocation, payment, usb, magnetometer, gyroscope, interest-cohort all `()` | This release needs none of these |
| `X-DNS-Prefetch-Control` | `off` | No speculative DNS lookups |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates the browsing context group |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevents cross-origin embedding of our responses |

`poweredByHeader: false` removes `X-Powered-By`.

The CSP mirrors the legacy static site's policy in `_headers` at the repository
root, with the additions the App Router needs. `connect-src` is narrowed to the
exact Supabase project origin derived from `NEXT_PUBLIC_SUPABASE_URL` rather
than the `*.supabase.co` wildcard. Development builds additionally allow
`'unsafe-eval'` (React Refresh) and `ws:` (hot module replacement);
`upgrade-insecure-requests` is production-only so localhost still works.

### Known CSP weakness

`script-src` includes `'unsafe-inline'`. The App Router bootstraps hydration
with inline scripts (`self.__next_f.push(...)`) that cannot be allowed by
origin alone, so the policy defends against injected *external* scripts,
clickjacking and form hijacking — but not against reflected inline XSS.

Upgrading to a nonce-based policy requires per-request randomness, which cannot
live in `next.config.ts`. The change would be:

1. Generate a nonce per request in `proxy.ts`.
2. Set it on both the request headers and the response `Content-Security-Policy`
   header — Next.js reads the nonce from the request-side CSP header and stamps
   it onto its own script tags.
3. Replace `'unsafe-inline'` with `'nonce-<value>' 'strict-dynamic'`.

The cost is that every route becomes dynamically rendered. Only
`/auth/auth-code-error` and `/_not-found` are still static today, so the
practical impact is small — but it needs its own test pass, which is why it is
not part of Batch 1.

Two verifications worth repeating after any change here: load a page in a real
browser and confirm the console shows no `Refused to…` violations, and confirm
no rendered page references a cross-origin script, style, font, or image
(currently none do).

`HSTS` deliberately omits `includeSubDomains`. It would force every subdomain of
the deployed host to HTTPS for the full max-age and cannot be reversed quickly.
Add it — and only afterwards `preload` — once the subdomain inventory has been
confirmed.

## Not yet addressed

- No application-level rate limiting. Supabase enforces its own limits on auth
  endpoints, which is the only throttle in place.
- No audit logging of authentication events.
- No CAPTCHA or bot protection on the registration form.
- Row Level Security policies are not part of Batch 1 — no application tables
  are read or written yet.
