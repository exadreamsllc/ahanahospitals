# Batch 1 test plan

## Prerequisites

1. `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Supabase → Authentication → URL Configuration → Site URL is set, and
   `http://localhost:3000/auth/confirm` is in the redirect allowlist.
3. Supabase → Authentication → Providers → Email has email/password signup and
   email confirmation enabled.
4. Confirmation and recovery email templates use `{{ .TokenHash }}` and point at
   `/auth/confirm`. **If this is not done, every confirmation link will land on
   `/auth/auth-code-error`** — this is the most common setup failure.
5. `npm run dev`, then browse to `http://localhost:3000`.

Use a real mailbox you control for the signup tests. Test accounts are created
in the live Supabase project, so use throwaway addresses and remove them
afterwards from Authentication → Users.

## Automated checks already run

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, no errors or warnings |
| `npm run build` | Pass, no errors or warnings, 16 routes compiled |
| Route probe against `next start` | All status codes and redirect targets as documented below |

The route probe covered: all public pages return 200; `/dashboard`, `/profile`,
`/library` redirect to login with the correct `next`; `/auth/reset-password`
without a session redirects to forgot-password; `/auth/confirm` with a missing,
invalid, or disallowed `type` redirects to the error page; `GET /auth/signout`
redirects without ending a session; `POST /auth/signout` returns 303; and
`?next=https://evil.example` is rejected.

Not covered automatically — these need the manual cases below: anything
requiring a real Supabase session, a delivered email, or a rendered browser.

## Manual test cases

### Registration

| # | Steps | Expected |
| --- | --- | --- |
| R1 | Submit `/auth/register` with all fields valid | Redirect to `/auth/check-email`, address shown, confirmation email arrives |
| R2 | Password shorter than 8 characters | Inline error under Password, no account created |
| R3 | Mismatched password confirmation | "Passwords do not match." under Confirm password |
| R4 | Leave the terms checkbox unticked | Error on the checkbox, no account created |
| R5 | Register with mixed-case email `Test@Example.com` | Account created; Supabase → Users shows `test@example.com` |
| R6 | Register with an address that already has a confirmed account | Same redirect to `/auth/check-email` as R1 — no hint that the account exists |
| R7 | Submit with an invalid email shape | Inline error under Email |
| R8 | Double-click Create account | Button disables and shows "Creating your account…", exactly one account created |
| R9 | Trigger a server-side error, then check the form | Name, email, language and account type are retained; both password fields are empty |

### Confirmation

| # | Steps | Expected |
| --- | --- | --- |
| C1 | Open the confirmation link from R1 | Signed in, redirected to `/dashboard` |
| C2 | Open the same link a second time | Redirected to `/auth/auth-code-error` |
| C3 | Visit `/auth/confirm?token_hash=abc&type=signup` | `/auth/auth-code-error` |
| C4 | Visit `/auth/confirm` with no parameters | `/auth/auth-code-error` |

### Login

| # | Steps | Expected |
| --- | --- | --- |
| L1 | Correct credentials | Redirect to `/dashboard` |
| L2 | Correct email, wrong password | "The email address or password is incorrect." |
| L3 | Unregistered email | Identical message to L2 |
| L4 | Sign in before confirming the email | "Please confirm your email address first…" |
| L5 | Sign in with the uppercase form of the R5 address | Succeeds |
| L6 | While signed in, visit `/auth/login` | Redirect to `/dashboard` |
| L7 | While signed in, visit `/auth/register` | Redirect to `/dashboard` |

### Route protection

| # | Steps | Expected |
| --- | --- | --- |
| P1 | Signed out, visit `/dashboard` | `/auth/login?next=%2Fdashboard` |
| P2 | Signed out, visit `/profile` | `/auth/login?next=%2Fprofile` |
| P3 | Signed out, visit `/library` | `/auth/login?next=%2Flibrary` |
| P4 | Complete P1, then sign in | Lands on `/dashboard`, not the home page |
| P5 | Sign in from `/auth/login?next=%2Fprofile` | Lands on `/profile` |
| P6 | Visit `/auth/login?next=https://evil.example` and sign in | Lands on `/dashboard`, never leaves the site |
| P7 | Visit `/resources` signed out | Loads; header shows Log in / Create account |
| P8 | Visit `/resources` signed in | Loads; header shows member nav and Sign out |

### Password reset

| # | Steps | Expected |
| --- | --- | --- |
| F1 | Submit a registered address at `/auth/forgot-password` | `/auth/check-email?mode=reset`, email arrives |
| F2 | Submit an unregistered address | Identical screen to F1, no email |
| F3 | Open the reset link | `/auth/reset-password` with the form shown |
| F4 | Enter a password shorter than 8 characters | Inline error, password unchanged |
| F5 | Enter mismatched passwords | "Passwords do not match." |
| F6 | Enter a valid matching password | Redirect to `/auth/login?status=password-updated` with a green banner |
| F7 | Sign in with the old password | Rejected |
| F8 | Sign in with the new password | Succeeds |
| F9 | Visit `/auth/reset-password` directly with no session | `/auth/forgot-password?status=link-expired` with a banner |
| F10 | Reopen the used reset link | `/auth/auth-code-error` |

### Sign out

| # | Steps | Expected |
| --- | --- | --- |
| S1 | Click Sign out in the header | `/auth/login?status=signed-out` |
| S2 | Click Sign out on the dashboard | Same as S1 |
| S3 | After signing out, press the browser Back button | `/dashboard` does not render; redirected to login |
| S4 | Visit `/auth/signout` directly in the address bar while signed in | Redirected to login **and still signed in** |

### Content pages

| # | Steps | Expected |
| --- | --- | --- |
| D1 | Dashboard after signing in | Greeting uses full name; email, preferred language and account type shown |
| D2 | Dashboard | Links to Resources, My Library, Profile all work; sign-out button present |
| D3 | Dashboard | "No medical records here" notice is visible |
| D4 | Profile | Shows name, email, confirmation state, language, account type; no clinical fields |
| D5 | Library | Explains that saving is not yet available |
| D6 | Resources | Lists the four categories; call to action differs by session state |

### Accessibility and responsiveness

| # | Steps | Expected |
| --- | --- | --- |
| A1 | Tab from the top of any page | First stop is a visible "Skip to main content" link |
| A2 | Tab through the registration form | Every control reachable in order with a clearly visible focus ring |
| A3 | Submit an invalid form with a screen reader active | The error banner is announced |
| A4 | Inspect an errored input | Has `aria-invalid="true"` and `aria-describedby` pointing at the message |
| A5 | View at 360px width | No horizontal scrolling; header stacks; buttons full width |
| A6 | View at 1440px width | Content is centred and capped, not stretched |
| A7 | Zoom the browser to 200% | Layout remains usable, nothing clipped |
| A8 | Enable "reduce motion" in the OS and submit a form | The pending spinner does not animate |
| A9 | Check headings on each page | Exactly one `<h1>`, no skipped levels |

### Security headers

| # | Steps | Expected |
| --- | --- | --- |
| H1 | Load any page with DevTools open | No `Refused to load/execute…` CSP violations in the console |
| H2 | Check response headers on `/` | CSP, nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP, CORP all present |
| H3 | Check response headers in a production deploy | `Strict-Transport-Security: max-age=31536000` present (absent in dev) |
| H4 | Check any response | No `X-Powered-By` header |
| H5 | Submit any auth form | Succeeds — `connect-src` permits the Supabase project origin |
| H6 | Attempt to embed the site in an `<iframe>` on another origin | Blocked |

### Metadata

| # | Steps | Expected |
| --- | --- | --- |
| M1 | View source on `/` | `<title>Ahana Hospitals \| Mental Health and Rehabilitation</title>` |
| M2 | View source on `/` | Description meta matches the approved copy |
| M3 | View source on any page | `<meta name="theme-color" content="#4C2E83">` |
| M4 | Visit `/dashboard` | Title is "Dashboard \| Ahana Hospitals"; `robots` is `noindex` |

## Known limitations

- Profile is read-only. There is no way to change name, language or account
  type after registration.
- Resources and Library are placeholders with no real content or saving.
- Account type is informational and grants nothing.
- No password strength meter beyond the 8-character minimum.
- No "resend confirmation email" control — the user must register again or wait
  for the link to expire.
- No rate limiting beyond what Supabase enforces.
- The CSP allows `'unsafe-inline'` for scripts, so it does not defend against
  reflected inline XSS. See docs/SECURITY.md for the nonce upgrade path.
- Privacy and Terms hold placeholder wording pending legal and clinical review.
- English and Tamil are selectable as a preference, but the interface itself is
  English-only — no translation layer exists yet.
- No automated test suite. `npm run lint` and `npm run build` are the only
  automated gates.
