/**
 * Product overview content — what the Ahana platform does today and what is
 * still to come. Used by /product-overview and the demo journey.
 */

import { ROUTES } from "@/lib/constants/site";

export type ModuleStatus = "live" | "coming-soon";

export type ProductModule = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  status: ModuleStatus;
  href?: string;
  /** Shown on the card so a client can see what is real today. */
  capabilities: readonly string[];
};

export const PRODUCT_MODULES: readonly ProductModule[] = [
  {
    id: "public-website",
    name: "Public website",
    summary: "The front door for families, referrers and the community.",
    detail:
      "A fast, accessible site carrying Ahana's services, care team, locations and contact routes. Everything here is open — no account is needed to read it.",
    status: "live",
    href: ROUTES.home,
    capabilities: [
      "Hero with English and Tamil welcome video",
      "Six care services",
      "Fifteen-person care team",
      "Locations and contact details",
    ],
  },
  {
    id: "member-identity",
    name: "Member identity",
    summary: "Secure accounts for people who want to save and return.",
    detail:
      "Email and password accounts backed by Supabase Auth, with email confirmation, password reset and server-verified sessions. Accounts hold a name, a language preference and an informational account type — nothing clinical.",
    status: "live",
    href: ROUTES.register,
    capabilities: [
      "Registration with email confirmation",
      "Password reset by email",
      "Server-side route protection",
      "No medical records, by design",
    ],
  },
  {
    id: "knowledge-centre",
    name: "Knowledge Centre",
    summary: "The growing archive of everything Ahana publishes.",
    detail:
      "One place for brochures, publications, research summaries, community programmes and videos, organised so material can be added over time without redesigning the site.",
    status: "live",
    href: ROUTES.resources,
    capabilities: [
      "Card-based catalogue",
      "Available and in-preparation states",
      "Open to everyone",
    ],
  },
  {
    id: "founder-legacy",
    name: "Founder legacy",
    summary: "The institutional history, preserved deliberately.",
    detail:
      "A dedicated home for the founder's story: biography, timeline, awards, gallery and recorded talks. The structure is built; Ahana supplies the confirmed history.",
    status: "live",
    href: ROUTES.founder,
    capabilities: [
      "Profile and biography",
      "Timeline scaffold",
      "Awards, gallery and video placeholders",
    ],
  },
  {
    id: "resources-brochures",
    name: "Resources and brochures",
    summary: "Publications families can read now and take away.",
    detail:
      "Downloadable brochures and long-form stories, starting with the founder profile and the 365 Days of Meaningful Living community programme.",
    status: "live",
    href: ROUTES.story365,
    capabilities: [
      "PDF brochure download",
      "Illustrated community story",
      "Tamil and English material",
    ],
  },
  {
    id: "my-library",
    name: "My Library",
    summary: "A personal shelf for the resources that matter to you.",
    detail:
      "Signed-in members get their own space for saved material. The area and its route protection are in place; saving itself arrives in a later release.",
    status: "live",
    href: ROUTES.library,
    capabilities: [
      "Protected member route",
      "Placeholder for saved items",
      "Saving arrives later",
    ],
  },
  {
    id: "lets-talk",
    name: "Let's Talk",
    summary: "A calm, obvious way to start a conversation.",
    detail:
      "Contact routes presented without pressure, plus a three-step explanation of what happens next and a clear emergency notice. Every path leads to a person at Ahana.",
    status: "live",
    href: ROUTES.letsTalk,
    capabilities: [
      "Phone and email channels",
      "What-happens-next explainer",
      "Emergency guidance",
    ],
  },
];

export const FUTURE_MODULES: readonly ProductModule[] = [
  {
    id: "saving",
    name: "Saving and reading progress",
    summary: "Keep a resource, and pick up where you left off.",
    detail:
      "Save any brochure, story or video to My Library, with reading progress carried across devices.",
    status: "coming-soon",
    capabilities: [],
  },
  {
    id: "tamil-ui",
    name: "Tamil interface",
    summary: "The portal itself in Tamil, not only the resources.",
    detail:
      "Language preference is already captured at registration. The next step is translating the interface around it.",
    status: "coming-soon",
    capabilities: [],
  },
  {
    id: "profile-editing",
    name: "Profile editing",
    summary: "Members update their own details.",
    detail:
      "Name, preferred language and account type editable from the profile page.",
    status: "coming-soon",
    capabilities: [],
  },
  {
    id: "callback",
    name: "Callback requests",
    summary: "Choose a time and let Ahana call you.",
    detail:
      "A structured request flow feeding the helpdesk, replacing the current phone-and-email-only routes.",
    status: "coming-soon",
    capabilities: [],
  },
  {
    id: "events",
    name: "Programmes and events",
    summary: "Dates, locations and participation for community programmes.",
    detail:
      "Turning 365 Days and similar initiatives into a living calendar with impact numbers and participant stories.",
    status: "coming-soon",
    capabilities: [],
  },
  {
    id: "search",
    name: "Search across the archive",
    summary: "Find any published item quickly.",
    detail:
      "Full-text search across brochures, stories, research and video descriptions as the archive grows.",
    status: "coming-soon",
    capabilities: [],
  },
];

/** The client demo journey, in order. */
export const DEMO_JOURNEY = [
  {
    step: 1,
    label: "Homepage",
    href: ROUTES.home,
    note: "The public front door — services, team, locations.",
  },
  {
    step: 2,
    label: "Product Overview",
    href: ROUTES.productOverview,
    note: "What the platform does today, and what is next.",
  },
  {
    step: 3,
    label: "Register or Log in",
    href: ROUTES.register,
    note: "Create a member identity, or sign in to an existing one.",
  },
  {
    step: 4,
    label: "Dashboard",
    href: ROUTES.dashboard,
    note: "The member's home. Requires a confirmed account.",
  },
  {
    step: 5,
    label: "Resources",
    href: ROUTES.resources,
    note: "The Knowledge Centre catalogue.",
  },
  {
    step: 6,
    label: "Our Founder",
    href: ROUTES.founder,
    note: "Institutional history and legacy.",
  },
  {
    step: 7,
    label: "365 Days",
    href: ROUTES.story365,
    note: "A published community story.",
  },
  {
    step: 8,
    label: "Let's Talk",
    href: ROUTES.letsTalk,
    note: "How a family starts a conversation.",
  },
] as const;
