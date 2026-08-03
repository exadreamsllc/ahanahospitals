/**
 * Knowledge Centre resource catalogue.
 *
 * `available` items exist today. Everything else is a demo placeholder — the
 * card renders a "Coming soon" state rather than a dead link.
 */

export type ResourceStatus = "available" | "coming-soon";

export type Resource = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: ResourceStatus;
  /** Present only when status is "available". */
  href?: string;
  /** Set when the link points at a downloadable file rather than a page. */
  download?: boolean;
  image?: string;
  meta?: string;
};

export const RESOURCES: readonly Resource[] = [
  {
    id: "founder-profile",
    category: "Founder",
    title: "Dr. C. Ramasubramanian — A Profile",
    description:
      "Founder profile covering community mental-health contributions, rehabilitation work and recognition.",
    status: "available",
    href: "/resources/founder-profile",
    download: false,
    meta: "Interactive brochure",
  },
  {
    id: "365-days",
    category: "365 Days",
    title: "365 Days of Meaningful Living",
    description:
      "A shared-meal initiative bringing people together with dignity, belonging and purpose — on ordinary days, not only on special occasions.",
    status: "available",
    href: "/resources/365-days",
    image: "/assets/365/hero.jpg",
    meta: "Community story",
  },
  {
    id: "brochures",
    category: "Brochures",
    title: "Service brochures",
    description:
      "Plain-language guides to each Ahana service, the admission process and what to expect during care.",
    status: "coming-soon",
    meta: "In preparation",
  },
  {
    id: "awards",
    category: "Awards",
    title: "Awards and recognition",
    description:
      "Honours received by Ahana and its clinicians for work in mental health, rehabilitation and community care.",
    status: "coming-soon",
    meta: "In preparation",
  },
  {
    id: "videos",
    category: "Videos",
    title: "Talks and awareness sessions",
    description:
      "Recorded talks, awareness sessions and introductions to the people who provide care at Ahana.",
    status: "coming-soon",
    meta: "In preparation",
  },
  {
    id: "research",
    category: "Research",
    title: "Research and publications",
    description:
      "Summaries of the neuropsychiatric and rehabilitation research Ahana clinicians contribute to.",
    status: "coming-soon",
    meta: "In preparation",
  },
] as const;

/** The 365 Days story, published on the V2 site. */
export const STORY_365 = {
  titleTamil: "மன நிறைவான 365 நாட்கள்",
  title: "365 Days of Meaningful Living",
  eyebrow: "Community mental health",
  summary:
    "A shared-meal initiative designed to bring people together with dignity, belonging and purpose — on ordinary days, not only on special occasions.",
  sections: [
    {
      heading: "Why this programme matters",
      body: "The original Tamil brochure presents a simple and humane idea: people should not feel remembered only on birthdays, festivals or special days. A meaningful life is built through everyday inclusion, shared meals, participation and community.",
    },
    {
      heading: "Easy to preserve, easy to revisit",
      body: "This digital story is arranged as an archive entry with a stable title, programme summary, photographs and future space for dates, locations, impact numbers and participant stories.",
    },
  ],
  gallery: [
    { src: "/assets/365/hero.jpg", alt: "Participants gathered for a shared meal" },
    {
      src: "/assets/365/community-table.jpg",
      alt: "A long community table set for the programme",
    },
    { src: "/assets/365/meal-service.jpg", alt: "Meals being served to participants" },
    { src: "/assets/365/prayer.jpg", alt: "A moment of prayer before the meal" },
    {
      src: "/assets/365/brochure-detail.jpg",
      alt: "Detail from the original Tamil programme brochure",
    },
  ],
} as const;
