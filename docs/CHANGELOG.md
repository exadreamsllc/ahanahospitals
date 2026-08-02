# Changelog

All notable changes to the Ahana V3 Next.js application.

This project uses [Semantic Versioning](https://semver.org/). Pre-1.0 releases
are alpha quality: interfaces may change without a major version bump.

## Unreleased

### Added

- **Local Supabase stack** for end-to-end authentication testing:
  `supabase/config.toml` plus `supabase/templates/confirmation.html` and
  `recovery.html`. The templates use the `token_hash` form that
  `app/auth/confirm/route.ts` requires, and now serve as executable
  documentation of the configuration production needs.

### Verified

- **The authenticated half of the application, for the first time.** All
  sixteen manual steps executed and passed: registration, email confirmation,
  session persistence, protected-route rendering, single-use link enforcement,
  sign-out, guard redirect with `next`, login returning to the intended target,
  password reset end to end, old password rejected, new password accepted, and
  signed-in users redirected away from login.
- This closes the six checks carried as **blocked** since v0.1.0-alpha.
- Incidental: CSP `connect-src 'self'` was observed blocking a real
  cross-origin fetch — unplanned confirmation the header works.

### Notes

- Application code is unchanged; the Supabase clients, proxy, security headers,
  route guards, validation and auth routes remain byte-identical to
  v0.3.0-alpha.
- Production credentials were never used. Test credentials live in a
  git-ignored `.env.test` pointing at the local stack.
- The run proves the application code is correct. It does not prove the
  production project's email templates are correct — that remains unverified.

## v0.3.0-alpha — Engineering Package 3: client demo completion and testing

Prepares the application for a client product overview. No change to the
authentication architecture, Supabase clients, session proxy, security headers
or route guards — all six protected paths verified unchanged from v0.2.0-alpha.

### Added

**Product Overview page**
- **`/product-overview`** — a visible page describing the public website,
  member identity, Knowledge Centre, founder legacy, resources and brochures,
  My Library, Let's Talk, and six future modules marked Coming Soon. Each live
  module lists its real capabilities so a client can see what exists today.
- `lib/content/product.ts` — module catalogue and demo journey definition.
- Added to the public navigation.

**Client demo flow**
- An eight-step guided journey rendered on `/product-overview` and documented
  in `DEMO-SCRIPT.md`:
  `/` → `/product-overview` → `/auth/register` or `/auth/login` →
  `/dashboard` → `/resources` → `/founder` → `/resources/365-days` →
  `/lets-talk`.
- All eight stops verified reachable, with `/dashboard` correctly gating when
  signed out.

**Favicon branding**
- Ahana favicon, SVG icon and Apple touch icon replacing the create-next-app
  defaults, which had been shipping a Next.js logo on a hospital site.

**Documentation**
- `PRODUCT-OVERVIEW.md` — what the platform does, module by module.
- `DEMO-SCRIPT.md` — a narrated 12–15 minute client walkthrough.
- `END-TO-END-TEST-RESULTS.md` — every check with pass/fail/blocked status.
- `KNOWN-LIMITATIONS.md` — blockers, required Supabase settings, awaited
  content, and technical caveats in one place.

### Fixed

**Image cropping**
- The 365 Days brochure photograph (portrait, 675×900) was cropped into a 16:10
  frame, discarding **53%** of the image including its title block. Resource
  cards, the 365 Days story hero and the dashboard continue-reading card now
  use `object-fit: contain` on a soft backdrop. Re-measured at **0% crop**.

**Layout consistency**
- Status badges on the product overview cards sat beside short titles and
  wrapped below long ones, making the grid read as ragged. Now consistently
  positioned above the title.

### Changed

- `lib/constants/site.ts` — additive only: one route constant and one
  navigation entry. Guard arrays untouched.

### Responsive verification

Layout verified at **390px, 768px and 1440px** across 11 public pages. Zero
horizontal overflow at any width. The team carousel holds three rows and 15
unique people at every breakpoint, scrolls horizontally at 390px and 768px, and
correctly hides its arrows on mobile in favour of touch swiping.

Media queries were evaluated at true viewport widths using a same-origin
iframe, because the available browser tooling could not resize the rendering
viewport. Breakpoint behaviour is therefore genuine, but touch interaction and
mobile browser chrome remain untested on a real device.

### End-to-end testing

**71 checks passed, 0 failed.** Full results in `END-TO-END-TEST-RESULTS.md`.
Covered: build and lint, all route status codes and guard redirects, an
internal link crawl (14 links, 0 broken), responsive layout, image distortion
and crop measurement across 26 images, the team carousel, dialog
accessibility, metadata and icons, and heading structure.

Verified against Supabase directly: the password-reset server action completes
a real round trip and redirects correctly, with account-enumeration resistance
intact, and server-side validation renders inline errors with correct
`aria-invalid` and `aria-describedby` wiring.

### Known limitations

Six authentication checks are **blocked** and one is **unverified**.

- The signed-in state of `/dashboard`, `/profile` and `/library`, logout,
  reset completion and session persistence are untested, because accounts
  cannot be created by the engineer and `mailer_autoconfirm` is `false`. A
  16-step manual script is provided.
- Dialog Escape-to-close could not be confirmed; the automation delivered no
  keypress to the page.
- Supabase confirmation and recovery email templates must be switched to
  `{{ .TokenHash }}` pointing at `/auth/confirm`, or every link lands on the
  error page.
- Founder timeline, awards and gallery remain deliberate placeholders; nothing
  about a real person has been invented.

See `KNOWN-LIMITATIONS.md` for the full list.

## v0.2.0-alpha — Engineering Package 2: client demo foundation

Builds the client-facing experience on top of the Package 1 foundation. The
authentication, Supabase, security, route-guard and session layers are
unchanged from v0.1.0-alpha and were verified byte-identical before release.

### Added

**Content layer** (`lib/content/`)
- `contact`, `services`, `team`, `locations`, `founder`, `resources` — all
  carried over from the approved V2 site rather than invented.

**Marketing components** (`components/marketing/`)
- `Hero` with an English/Tamil welcome video toggle, `TrustBand`,
  `ServicesSection`, `FounderSection`, `TeamSection` + `TeamScroller`,
  `LetsTalkSection`, `ResourcesSection`, `ResourceCard`, `SectionHeading`.
- `TeamScroller` renders three rows scrolling sideways across 15 distinct
  people, with a native `<dialog>` for each person's detail.

**Pages**
- `/founder` — profile, biography, timeline, and awards/gallery/videos
  placeholders.
- `/lets-talk` — contact channels, three-step explainer, privacy panel. UX
  only: no form submission, no storage, no triage.
- `/resources/365-days` — the 365 Days of Meaningful Living story.

**Assets** (`public/assets/`)
- Logo, campus, family and founder imagery, NABH badge, 15 team portraits,
  five programme photographs, two welcome videos, founder profile PDF.

### Changed

- Homepage rebuilt with all eight approved sections, replacing the Package 1
  placeholder.
- Dashboard rebuilt: welcome, continue reading, My Library, Founder Legacy,
  Resources, 365 Days and Coming Soon cards. The `requireUser` guard and
  metadata reads are unchanged.
- Knowledge Centre rebuilt with available / in-preparation card groups.
- `styles/tokens.css` and `styles/base.css`: additive only — display serif,
  marketing surfaces, section and panel helpers.
- `lib/constants/site.ts`: additive only — three route constants and three
  navigation entries. `PROTECTED_ROUTE_PREFIXES` and `GUEST_ONLY_ROUTES` are
  untouched.

### Verification

`npm run lint` and `npm run build` pass with zero errors and zero warnings.
Route guards re-probed against a running production server and still redirect
correctly. Homepage checked in a browser for horizontal overflow, heading
structure, missing alt text and broken images — all clean.

### Known limitations

- The founder biography and timeline are deliberate placeholders. Dr. C.
  Ramasubramanian is a real person and only a one-line summary was available,
  so dates, awards and milestones are marked "to be confirmed" rather than
  invented.
- The founder portrait attribution is inferred from the filename and needs
  Ahana's confirmation.
- `public/assets/` is roughly 20 MB, 15 MB of it the two welcome videos.
  Consider Git LFS or a CDN.
- Brand tokens remain the Package 1 approved values, which differ slightly
  from the legacy V2 stylesheet.
- The dashboard was not visually verified — it requires a real Supabase
  session.
- Mobile layout verified by CSS review and an overflow check, not on a device.
- `hospital.webp` is only 611×344 and looks soft on large screens.

## v0.1.0-alpha — Batch 1: identity and application foundation

First release of the Next.js 16 rewrite. Establishes the design system,
component library, and complete Supabase authentication flow. **Not production
ready** — see Known limitations.

### Added

**Design system**
- Ahana brand tokens as CSS custom properties (`styles/tokens.css`) covering the
  approved palette plus spacing, radius, typography and elevation scales.
- Element defaults, focus-ring treatment, skip link and layout helpers
  (`styles/base.css`).

**Component library**
- UI: `FormField`, `SelectField`, `CheckboxField`, `AlertMessage`,
  `PrimaryButton`, `LoadingButton`, `SecondaryLink`.
- Layout: `AppHeader`, `AppFooter`, `MemberShell`.
- Auth: `AuthShell`, `AuthCard`, and four client forms.
- All strongly typed, keyboard accessible, responsive, and styled with CSS
  Modules.

**Authentication**
- Registration with server-side validation, email lowercasing, and allowlist
  coercion of preferred language and account type.
- Email confirmation at `/auth/confirm` with OTP type allowlisting.
- Login with a generic failure message.
- Password reset: request, recovery session, update, forced re-authentication.
- POST-only sign-out.

**Routes**
- Public: `/`, `/resources`, `/privacy`, `/terms`, and the auth screens.
- Protected: `/dashboard`, `/profile`, `/library`.

**Security**
- Two-layer route protection: proxy plus page-level guards, both using
  `auth.getUser()`.
- Open-redirect protection on every user-supplied `next` parameter.
- Account-enumeration resistance on register, login and password reset.
- Safe error mapping — raw Supabase error text is never rendered or logged.
- Security headers in `next.config.ts`: CSP, HSTS (production), `nosniff`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP, CORP.

**Documentation**
- `docs/ARCHITECTURE.md`, `AUTHENTICATION.md`, `SECURITY.md`, `ROUTES.md`,
  `BATCH-1-TEST-PLAN.md` (66 manual cases), and `CLAUDE.md`.

### Changed

- `app/layout.tsx`: approved title, description, and `#4C2E83` theme colour,
  replacing the create-next-app defaults.
- `app/page.tsx`: Ahana landing page replacing the Next.js scaffold.
- `app/auth/register/page.tsx`: rebuilt on the component library; the inline
  style object is gone.
- `utils/supabase/middleware.ts`: route protection added. The three Supabase
  client factories are otherwise unchanged.

### Security notes

- No service-role key is used, requested, or supported.
- No clinical or medical data is stored. User metadata is exactly three fields:
  `full_name`, `preferred_language`, `account_type`.
- Account type is informational and grants no privileges. Staff and admin values
  do not exist in the allowlist.

### Required setup

Confirmation and recovery email templates in Supabase must use
`{{ .TokenHash }}` and point at `/auth/confirm`. With the default
`{{ .ConfirmationURL }}` template, every confirmation link lands on the error
page. See `docs/AUTHENTICATION.md`.

### Verification

`npm run lint` and `npm run build` both pass with zero errors and zero warnings.
Route guards, redirect targets and security headers were probed against a
running production server. No automated test suite exists yet.

### Known limitations

- Profile is read-only; no way to change name, language or account type after
  registration.
- Resources and Library are placeholders — no content, no saving.
- CSP allows `'unsafe-inline'` for scripts, so it does not defend against
  reflected inline XSS. Nonce upgrade path documented in `docs/SECURITY.md`.
- HSTS omits `includeSubDomains` pending confirmation of the subdomain
  inventory.
- No "resend confirmation email" control.
- No rate limiting beyond what Supabase enforces; no CAPTCHA; no audit logging.
- Privacy and Terms carry placeholder wording pending legal and clinical review.
- Interface is English-only; language is stored as a preference but no
  translation layer exists.
- No automated tests.
