# Ahana V3 — Product Overview

A plain-language description of what the platform does today. The customer-
facing version of this page lives at `/product-overview`.

## The shape of the product

Ahana V3 has two halves:

- A **public website** anyone can read without an account.
- A **member area** for people who want to save what they find and return to it.

Nothing in either half holds clinical or medical information. See the
clinical-data boundary in `SECURITY.md`.

## Modules available today

| Module | What it does | Route |
| --- | --- | --- |
| Public website | Services, care team, locations, contact routes | `/` |
| Member identity | Supabase-backed accounts with email confirmation and password reset | `/auth/register` |
| Knowledge Centre | Catalogue of brochures, publications, research, programmes and videos | `/resources` |
| Founder legacy | Institutional history: profile, biography, timeline, archive placeholders | `/founder` |
| Resources and brochures | Downloadable founder profile PDF and the 365 Days community story | `/resources/365-days` |
| My Library | Protected personal space for saved resources | `/library` |
| Let's Talk | Contact routes, what-happens-next explainer, emergency guidance | `/lets-talk` |

### Public website

The front door for families, referrers and the community. Carries the hero with
an English/Tamil welcome video, six care services, a fifteen-person care team
presented as a three-row horizontal carousel, locations, and the NABH
accreditation mark.

### Member identity

Email and password accounts backed by Supabase Auth. Registration requires
email confirmation. Passwords can be reset by email. Sessions are validated
server-side on every request with `auth.getUser()`.

An account stores exactly three things: full name, preferred language, and an
informational account type. Account type grants no privileges.

### Knowledge Centre

A card catalogue split into "Available now" and "In preparation". Two items are
live today: the founder profile PDF and the 365 Days of Meaningful Living
story. Brochures, awards, videos and research are structured but awaiting
content.

### Founder legacy

A dedicated home for Ahana's institutional history. The profile, biography
frame, timeline structure and archive placeholders are built. Confirmed dates,
awards and photographs come from Ahana — see the limitation in
`KNOWN-LIMITATIONS.md`.

### My Library

A protected route with its own placeholder. Saving arrives in a later release;
the route protection and member framing exist now.

### Let's Talk

Contact presented without pressure: phone and email today, callback and guided
support marked as coming. A three-step explainer sets expectations, and an
emergency notice sits above everything else. No form submission, no message
storage, no automated triage — every path leads to a person at Ahana.

## Coming soon

Listed on `/product-overview` so the shape of the platform is clear from the
start. None of these are built.

- Saving and reading progress
- Tamil interface (the portal itself, not only the resources)
- Profile editing
- Callback requests
- Programmes and events calendar
- Search across the archive

## What this product deliberately is not

- It is not a medical record system.
- It is not a patient portal — there are no appointments, results or clinical
  notes.
- It does not provide diagnosis, triage or treatment advice.
- It is not an emergency service, and says so wherever contact is offered.
