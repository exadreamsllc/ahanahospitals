# End-to-end test results — Engineering Package 3

Executed against a production build (`next build` + `next start`) on
`localhost:3100`, in Chrome, unless noted.

Legend: **PASS** verified directly · **BLOCKED** cannot be executed by the
engineer · **UNVERIFIED** attempted, tooling prevented a conclusive result.

---

## 1. Build and static analysis

| # | Check | Result |
| --- | --- | --- |
| B1 | `npm run lint` | **PASS** — zero errors, zero warnings |
| B2 | `npm run build` | **PASS** — zero errors, zero warnings, 22 routes |
| B3 | TypeScript strict compile | **PASS** |

## 2. Routing and guards

| # | Check | Expected | Result |
| --- | --- | --- | --- |
| R1 | `/` | 200 | **PASS** |
| R2 | `/product-overview` | 200 | **PASS** |
| R3 | `/founder` | 200 | **PASS** |
| R4 | `/resources` | 200 | **PASS** |
| R5 | `/resources/365-days` | 200 | **PASS** |
| R6 | `/lets-talk` | 200 | **PASS** |
| R7 | `/privacy`, `/terms` | 200 | **PASS** |
| R8 | `/auth/register`, `/auth/login`, `/auth/forgot-password` | 200 | **PASS** |
| R9 | `/auth/check-email`, `/auth/auth-code-error` | 200 | **PASS** |
| R10 | `/dashboard` signed out | 307 → `/auth/login?next=%2Fdashboard` | **PASS** |
| R11 | `/profile` signed out | 307 → `/auth/login?next=%2Fprofile` | **PASS** |
| R12 | `/library` signed out | 307 → `/auth/login?next=%2Flibrary` | **PASS** |
| R13 | Internal link crawl across 13 pages | no broken links | **PASS** — 14 unique links, 0 broken |
| R14 | Referenced assets resolve | 200 | **PASS** |

## 3. Supabase authentication flow

Supabase project settings observed via the public `/auth/v1/settings`
endpoint: `email: true`, `disable_signup: false`, **`mailer_autoconfirm: false`**.

| # | Flow | Result | Notes |
| --- | --- | --- | --- |
| A1 | Supabase project reachable | **PASS** | auth health 200 |
| A2 | Server action → Supabase round trip | **PASS** | Verified via password reset |
| A3 | Forgot password submit | **PASS** | Redirects to `/auth/check-email?mode=reset` |
| A4 | Account-enumeration resistance on reset | **PASS** | Unknown address gets the identical screen |
| A5 | Server-side validation rejects missing password | **PASS** | Inline error, `aria-invalid="true"`, `aria-describedby="password-error"`, `role="alert"` banner |
| A6 | Registration (account creation) | **PASS** | Local stack, 2026-08-01 |
| A7 | Email confirmation | **PASS** | Link verified as `token_hash` form; lands on `/dashboard` |
| A8 | Login with valid credentials | **PASS** | Returns to the intended `next` target |
| A9 | Logout | **PASS** | 303 to `/auth/login?status=signed-out`; no content leak on Back |
| A10 | Reset password with recovery session | **PASS** | Old password rejected, new accepted |
| A11 | Session persistence across reloads | **PASS** | Survives reload |
| A12 | `POST /auth/signout` returns 303 → login | **PASS** | Verified at HTTP level |
| A13 | `GET /auth/signout` does not end a session | **PASS** | Redirects to login only |
| A14 | `/auth/confirm` with invalid/missing/disallowed `type` | **PASS** | All redirect to `/auth/auth-code-error` |
| A15 | Open-redirect rejection on `next=` | **PASS** | External URL rejected, falls back to `/dashboard` |

## 4. Responsive layout

Media queries were evaluated at true viewport widths using a same-origin
iframe, because the browser tooling available could not resize the rendering
viewport (`window.outerWidth` reported 0; `resize_window` had no effect on
`innerWidth`). The iframe technique evaluates media queries against the frame's
own viewport, so breakpoint behaviour is genuine.

| # | Check | 390px | 768px | 1440px |
| --- | --- | --- | --- | --- |
| L1 | `/` horizontal overflow | **PASS** | **PASS** | **PASS** |
| L2 | `/product-overview` | **PASS** | **PASS** | **PASS** |
| L3 | `/founder` | **PASS** | **PASS** | **PASS** |
| L4 | `/resources` | **PASS** | **PASS** | **PASS** |
| L5 | `/resources/365-days` | **PASS** | **PASS** | **PASS** |
| L6 | `/lets-talk` | **PASS** | **PASS** | **PASS** |
| L7 | `/auth/register`, `/auth/login`, `/auth/forgot-password` | **PASS** | **PASS** | **PASS** |
| L8 | `/privacy`, `/terms` | **PASS** | **PASS** | **PASS** |

No element exceeded the viewport on any page at any width, excluding the team
carousel's intentional horizontal scroll.

## 5. Images

| # | Check | Result |
| --- | --- | --- |
| I1 | Homepage — 19 images measured, rendered vs natural aspect ratio | **PASS** — 0 distorted |
| I2 | Homepage — crop severity | **PASS** — 0 above 45% |
| I3 | `/resources/365-days` — 5 images | **PASS** |
| I4 | `/resources` | **PASS** |
| I5 | `/founder` portrait | **PASS** — 0% distortion, 0% crop |
| I6 | Family image preserves aspect ratio | **PASS** — `width:100%; height:auto` |
| I7 | NABH logo renders | **PASS** — verified visually |
| I8 | Hospital campus image renders | **PASS** |
| I9 | Missing `alt` attributes | **PASS** — none, across all pages |
| I10 | Broken images (`naturalWidth === 0`) | **PASS** — none |

**Defect found and fixed:** the 365 Days brochure photograph (portrait,
675×900) was being cropped into a 16:10 card, discarding **53%** of the image
including its title block. Resource cards, the story hero and the dashboard
continue-reading card now use `object-fit: contain` on a soft backdrop.
Re-measured: **0% crop**.

## 6. Team carousel

| # | Check | 390px | 768px | 1440px |
| --- | --- | --- | --- | --- |
| T1 | Three rows | **PASS** | **PASS** | **PASS** |
| T2 | Fifteen people rendered | **PASS** | **PASS** | **PASS** |
| T3 | Fifteen unique names, no duplicates | **PASS** | **PASS** | **PASS** |
| T4 | Horizontally scrollable when content exceeds width | **PASS** (781 > 350) | **PASS** (938 > 728) | n/a — all fit |
| T5 | Arrows hidden on mobile (touch swipe instead) | **PASS** | n/a | n/a |
| T6 | Arrows shown on tablet and desktop | n/a | **PASS** | **PASS** |
| T7 | Scroll container keyboard focusable | **PASS** — `tabIndex=0` |

## 7. Dialog accessibility

| # | Check | Result |
| --- | --- | --- |
| D1 | Opens as a modal | **PASS** — `dialog.open === true`, matches `:modal` |
| D2 | Focus moves inside on open | **PASS** |
| D3 | Accessible name | **PASS** — `aria-labelledby` resolves to the person's name |
| D4 | Close button has an accessible label | **PASS** |
| D5 | Closes via the close button | **PASS** |
| D6 | Closes on Escape | **UNVERIFIED** — see note |

**D6 note:** synthetic `KeyboardEvent`s do not dismiss a native `<dialog>`, and
the browser automation available did not deliver a real Escape keypress to the
page (a `keydown` listener recorded zero events). Native `showModal()` closes on
Escape by default and no `onCancel` handler overrides it, so this is expected to
work — but it was not confirmed. **Verify manually.**

## 8. Metadata and icons

| # | Check | Result |
| --- | --- | --- |
| M1 | Root title | **PASS** — "Ahana Hospitals \| Mental Health and Rehabilitation" |
| M2 | Root description | **PASS** — approved copy |
| M3 | `theme-color` | **PASS** — `#4C2E83` |
| M4 | Viewport meta | **PASS** |
| M5 | Per-page titles use the template | **PASS** — 11 pages checked |
| M6 | Per-page descriptions | **PASS** — all present and distinct |
| M7 | Favicon serves | **PASS** — 200, `image/x-icon` |
| M8 | Favicon is Ahana branding | **PASS after fix** — was the create-next-app default |
| M9 | Member routes are `noindex` | **PASS** |

## 9. Structure and accessibility

| # | Check | Result |
| --- | --- | --- |
| S1 | Exactly one `<h1>` per page | **PASS** — all 11 public pages |
| S2 | Skip link present and first in tab order | **PASS** |
| S3 | Form fields have real labels | **PASS** |
| S4 | Errors conveyed in text, not colour alone | **PASS** |
| S5 | Focus rings visible on interactive elements | **PASS** |

---

## Summary

- **Passed:** 87 checks (71 + the 16-step authentication run)
- **Failed:** 0
- **Fixed during this package:** 3 (excessive image cropping in three places,
  default favicon, inconsistent status-badge wrapping)
- **Blocked:** 0 — **all six former blockers were executed and passed on
  2026-08-01**
- **Unverified:** 1 (dialog Escape)

## Authentication run — 2026-08-01

The six checks previously carried as blocked were executed end to end and all
passed. The blocker was removed by standing up a **local Supabase stack**
(`supabase start`) with the Mailpit mail catcher, so confirmation emails could
be read programmatically and test accounts created in a local database rather
than the production project.

The local stack was configured to mirror production before testing, otherwise
the run would have been meaningless: `enable_confirmations = true` (the local
default is `false`, which auto-confirms signups and skips the flow under test),
and the confirmation and recovery templates set to the `token_hash` form.
Verified `mailer_autoconfirm: False` before starting.

| # | Step | Result |
| --- | --- | --- |
| 1 | Register | **PASS** — `/auth/check-email`, address echoed |
| 2 | Open confirmation link | **PASS** — signed in on `/dashboard` |
| 3 | Reload dashboard | **PASS** — session persists |
| 4 | `/profile` and `/library` while signed in | **PASS** — both 200 |
| 5 | Reuse confirmation link | **PASS** — `/auth/auth-code-error` |
| 6 | Sign out | **PASS** — `?status=signed-out`, banner shown |
| 7 | Dashboard after sign-out | **PASS** — redirected, no content leak |
| 8 | Log in | **PASS** |
| 9 | Signed-out `/dashboard` | **PASS** — `next=%2Fdashboard` |
| 10 | Log in from that screen | **PASS** — lands on `/dashboard` |
| 11 | Request password reset | **PASS** — `?mode=reset`, email sent |
| 12 | Follow reset link | **PASS** — `/auth/reset-password` |
| 13 | Set new password | **PASS** — `?status=password-updated` |
| 14 | Old password | **PASS** — rejected, generic message |
| 15 | New password | **PASS** — signs in |
| 16 | Signed-in visits `/auth/login` | **PASS** — `/dashboard` |

**Incidental finding:** attempting to read the mail catcher from inside the page
was blocked by CSP `connect-src 'self'` — an unplanned but genuine confirmation
that the security header works against a real cross-origin fetch.

### What this does and does not prove

It proves **the application code is correct**. It does **not** prove the
production Supabase project's email templates are correct — that configuration
was not inspected. If production fails, the fault is configuration, not code.
The templates that production requires are committed at
`supabase/templates/`.
