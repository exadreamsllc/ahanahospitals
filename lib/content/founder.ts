/**
 * Founder page content.
 *
 * IMPORTANT: Dr. C. Ramasubramanian is a real person. Nothing in this file
 * asserts a biographical fact that is not present in the approved V2 site or
 * the founder profile brochure. Dates, awards, and detailed history are
 * deliberately left as `pending` entries for Ahana to supply rather than being
 * invented — a plausible-looking fabricated biography would be worse than an
 * obvious placeholder.
 */

export const FOUNDER = {
  name: "Dr. C. Ramasubramanian",
  title: "Founder, Ahana Hospitals",
  portrait: "/assets/founder.webp",
  /** Drawn from the founder profile brochure summary on the V2 site. */
  summary:
    "Founder of Ahana Hospitals, known for contributions to community mental health, rehabilitation work, public education and recognition in the field.",
  brochureUrl: "/assets/brochures/dr-c-ramasubramanian-profile.pdf",
} as const;

export type TimelineEntry = {
  /** Era label. `null` where Ahana has not yet confirmed a date. */
  period: string | null;
  title: string;
  description: string;
  /** True when the entry is a structural placeholder awaiting real content. */
  pending: boolean;
};

/**
 * Timeline scaffold. The four themes below are the ones the approved brochure
 * summary names. Specific years and events are marked pending.
 */
export const FOUNDER_TIMELINE: readonly TimelineEntry[] = [
  {
    period: null,
    title: "Early practice and training",
    description:
      "Education, training and the beginning of clinical practice. Ahana to supply dates and detail.",
    pending: true,
  },
  {
    period: null,
    title: "Founding Ahana Hospitals",
    description:
      "The founding of Ahana and the establishment of neuropsychiatric care in Madurai. Ahana to supply the founding year and story.",
    pending: true,
  },
  {
    period: null,
    title: "Community mental health",
    description:
      "Programmes taking mental-health care beyond the hospital and into the community.",
    pending: true,
  },
  {
    period: null,
    title: "Rehabilitation and education",
    description:
      "Rehabilitation services, caregiver education and public awareness work.",
    pending: true,
  },
  {
    period: null,
    title: "Recognition",
    description:
      "Honours and recognition received for contributions to the field. Ahana to supply the list.",
    pending: true,
  },
] as const;

/** Biography paragraphs. Only the approved summary is asserted as fact. */
export const FOUNDER_BIOGRAPHY: readonly string[] = [
  "Ahana Hospitals was founded on a simple belief: every person deserves to be heard, treated with dignity and supported beyond the hospital walls.",
  "That belief shapes how care is delivered today — clinical treatment combined with rehabilitation, family involvement and community participation.",
];

export const FOUNDER_BIOGRAPHY_NOTE =
  "The full biography is being prepared with Ahana. The founder profile brochure is available to read in the meantime.";
