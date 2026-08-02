# Known limitations — Ahana V3 (as of v0.3.0-alpha)

Everything here is deliberate, blocked, or scheduled. Nothing is a surprise.

**Last updated 2026-08-01** — the authentication blocker in §1 is now closed.

## 1. Resolved: authenticated flows are now verified

**Status: closed 2026-08-01.** This section previously described the largest
gap in the system — the signed-in half had never been executed. It has now been
run end to end, all sixteen steps, all passing. Full results in
`END-TO-END-TEST-RESULTS.md`.

**How the blocker was removed:** a local Supabase stack (`supabase start`) with
the Mailpit mail catcher, so confirmation emails can be read programmatically
and test accounts created in a local database rather than the production
project. Configuration is committed at `supabase/config.toml` and
`supabase/templates/`.

The local stack was first configured to mirror production — `enable_confirmations
= true` and `token_hash` templates — otherwise the run would have proved
nothing. Verified `mailer_autoconfirm: False` before starting.

### What remains unproven

The run proves **the application code is correct**. It does **not** prove the
production Supabase project's templates are configured correctly, because that
configuration was not inspected. If production misbehaves, the fault is
configuration rather than code — and §2 below is exactly what to check.

Re-run the sixteen steps against production once, before real users arrive.

## 2. Required Supabase configuration

The flows above **will not work** until these are set. This is the single most
likely cause of a failed demo.

| # | Setting | Where | Value |
| --- | --- | --- | --- |
| 1 | Site URL | Authentication → URL Configuration | Your deployed origin, or `http://localhost:3000` for local |
| 2 | Redirect URLs | Authentication → URL Configuration | Add `<origin>/auth/confirm` for production **and** every preview domain |
| 3 | Email provider | Authentication → Providers → Email | Enabled, with email confirmation on |
| 4 | Confirmation email template | Authentication → Email Templates → Confirm signup | Must use `{{ .TokenHash }}` and point at `/auth/confirm` |
| 5 | Recovery email template | Authentication → Email Templates → Reset password | Same — `{{ .TokenHash }}` pointing at `/auth/confirm` |

**Item 4 and 5 are the critical ones.** Supabase ships templates using
`{{ .ConfirmationURL }}`, which is the older implicit flow. Our
`/auth/confirm` route handler expects `token_hash` and `type` query parameters.
With the default template, `token_hash` is absent and **every confirmation and
reset link lands on `/auth/auth-code-error`.**

The template link should resolve to:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

and for recovery:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password
```

Optionally set `NEXT_PUBLIC_SITE_URL` in the environment so email links always
use the canonical origin rather than a forwarded `Host` header.

## 3. Unverified: dialog Escape key

The team member dialog was confirmed to open modally, trap focus, carry an
accessible name and close via its button. **Escape-to-close was not confirmed**
— the automation could not deliver a real keypress to the page. Native
`<dialog>` closes on Escape by default and nothing overrides it, so this is
expected to work. Press Escape once manually to confirm.

## 4. Content still awaited from Ahana

- **Founder timeline dates and events.** Every entry currently reads "Date to
  be confirmed". Dr. C. Ramasubramanian is a real person, so no dates, awards
  or milestones have been invented to fill the page.
- **Founder awards, gallery and videos.** Structural placeholders only.
- **Founder portrait attribution.** The image is `founder.webp` from the
  approved V2 site and clearly shows someone other than the CEO, but the V2 site
  only ever captioned it "a welcome from our doctor". Confirm the identity
  before showing this to a client.
- **Brochures, awards, research and video categories** in the Knowledge Centre
  are card placeholders awaiting material.
- **Privacy Notice and Terms of Use** carry placeholder wording pending legal
  and clinical review. These are linked from the registration consent checkbox,
  so they must be approved before launch.

## 5. Functional gaps (scheduled, not defects)

- Saving to My Library does not work. The route and framing exist.
- Reading progress is not tracked. The dashboard shows the latest story.
- Profile is read-only.
- Let's Talk has no form submission, no storage, no triage.
- Search does not exist.
- Account type is informational and grants no privileges.

## 6. Technical limitations

- **CSP allows `'unsafe-inline'` for scripts.** The App Router bootstraps
  hydration with inline scripts. The policy defends against injected external
  scripts, clickjacking and form hijacking, but not reflected inline XSS. The
  nonce upgrade path is documented in `SECURITY.md`.
- **HSTS omits `includeSubDomains`** pending confirmation of the subdomain
  inventory.
- **No automated test suite.** `npm run lint` and `npm run build` are the only
  automated gates; everything else is manual or scripted browser checks.
- **No rate limiting** beyond what Supabase enforces. No CAPTCHA. No audit
  logging of authentication events.
- **`public/assets/` is roughly 20 MB**, 15 MB of it the two welcome videos.
  Consider Git LFS or a CDN before the repository grows further.
- **`hospital.webp` is only 611×344** and looks soft on large screens. A higher
  resolution source would improve the homepage noticeably.
- **Responsive testing used a same-origin iframe**, not a real device or
  viewport resize, because the available tooling could not resize the rendering
  viewport. Media queries evaluate genuinely in an iframe, so breakpoint
  behaviour is real — but touch interaction, mobile browser chrome and device
  pixel behaviour are untested. Check the homepage on a real phone before the
  demo.
- **The interface is English-only.** Preferred language is captured and stored
  but nothing is translated yet, apart from the Tamil welcome video and the
  Tamil title on the 365 Days story.

## 7. Repository state

- The git repository has **no remote configured**. All commits and tags are
  local only.
- The legacy static Cloudflare site still lives at the repository root. It is
  not part of the Next.js application and its `SUPABASE-CONNECTION.md`
  describes the older, framework-free architecture.
