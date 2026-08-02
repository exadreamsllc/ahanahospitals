# Ahana V3 — Client Demo Script

A guided walkthrough for a client product overview. Roughly 12–15 minutes.

## Before you start

1. `npm run build && npm run start` (or `npm run dev`), then open
   `http://localhost:3000`.
2. **Have a confirmed member account ready.** Registration requires email
   confirmation, so create and confirm the account before the meeting rather
   than live. See `END-TO-END-TEST-RESULTS.md` for the Supabase settings this
   depends on.
3. Sign out before you begin, so the demo starts from a visitor's point of view.
4. Have a phone-sized window or device to hand for the responsive moment.

## The route sequence

```
/  →  /product-overview  →  /auth/register or /auth/login  →  /dashboard
   →  /resources  →  /founder  →  /resources/365-days  →  /lets-talk
```

## Step 1 — Homepage (`/`)

**Say:** "This is the public front door. Anyone can read all of it — no account
needed."

Show, in order:
- The hero, and press play on the welcome video. **Switch to தமிழ்** — the
  Tamil track loads on the same card.
- Scroll to the campus band and the NABH accreditation line.
- The six services.
- The care team. **Scroll it sideways** — three rows, fifteen people. Click a
  person; a dialog opens with their role and background. Close it.
- Locations and contact.

**Point out:** the clinical-data boundary in the footer, on every single page.

## Step 2 — Product Overview (`/product-overview`)

**Say:** "Here is the whole platform on one page — what is built, and what is
planned."

Show:
- The two-halves framing at the top.
- "What is built" — seven live modules, each with its real capabilities.
- "Coming soon" — six roadmap items, clearly marked as not built.
- The eight-step guided tour at the bottom, which is the path we are following.

**This is the page to linger on** if the client wants scope and roadmap rather
than screens.

## Step 3 — Register or Log in (`/auth/register`)

**Say:** "Members get an account so they can save what they find."

Show:
- The seven registration fields.
- **Trigger a validation error deliberately** — submit with mismatched
  passwords. The error appears inline under the right field, in words, not just
  colour.
- Mention: email is normalised to lowercase, account type is informational only
  and grants nothing, and the account holds no medical data.

Then sign in with your pre-confirmed account at `/auth/login`.

**If you registered live**, you land on `/auth/check-email` — a good moment to
explain that confirmation is required before sign-in.

## Step 4 — Dashboard (`/dashboard`)

**Say:** "This is the member's home."

Show:
- The welcome line using their name.
- Continue Reading — the latest published story.
- The three Explore cards: My Library, Founder Legacy, Resources.
- Account summary: email, preferred language, account type.
- Coming Soon cards — saving, reading progress, Tamil interface, profile
  editing.
- The "no medical records here" notice.

**Point out:** try opening `/dashboard` in a private window. It redirects to
login and returns you here after signing in.

## Step 5 — Resources (`/resources`)

**Say:** "Everything Ahana publishes, in one archive."

Show:
- "Available now" — the founder profile PDF and the 365 Days story.
- "In preparation" — brochures, awards, videos, research, each visibly a
  placeholder rather than a dead link.

## Step 6 — Our Founder (`/founder`)

**Say:** "Institutional history, preserved deliberately."

Show:
- The profile and portrait.
- The biography.
- The timeline structure.
- The awards, gallery and video placeholders.

**Be candid:** the timeline dates and awards are marked "to be confirmed"
because Ahana supplies them. This is deliberate — nothing about a real person
has been invented to fill space.

## Step 7 — 365 Days (`/resources/365-days`)

**Say:** "This is what a published story looks like."

Show:
- The Tamil and English titles together.
- The programme summary and the two sections.
- The photo gallery.

**Point out:** this is the template every future story will use.

## Step 8 — Let's Talk (`/lets-talk`)

**Say:** "And this is how a family actually starts a conversation."

Show:
- The emergency notice at the top — deliberately first.
- Phone and email, live today. Callback and guided support marked coming soon.
- The three-step "what happens next" explainer.
- The privacy panel.

**Close on:** "No form here stores anything, and nothing is automated. Every
path leads to a person at Ahana."

## Optional — responsive moment

Narrow the window to phone width on the homepage. The header stacks, the
service cards go single-column, and the team carousel becomes swipeable with
the arrows hidden.

## Questions you should expect

**"Can members see their medical records?"**
No. By design. The platform stores a name, a language preference and an account
type. Nothing clinical, anywhere.

**"Is the founder history finished?"**
The structure is. The confirmed dates, awards and photographs come from Ahana.

**"Can people save things yet?"**
Not yet. My Library exists and is protected; saving is the next release.

**"Is it secure?"**
Sessions are verified server-side on every request. Member routes are guarded
in two independent layers. See `SECURITY.md` for the full control list, and its
"known CSP weakness" section for the one honest caveat.
