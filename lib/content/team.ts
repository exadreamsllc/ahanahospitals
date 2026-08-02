/**
 * The Ahana care team.
 *
 * Names, roles, portraits and descriptions are carried over verbatim from the
 * approved V2 site. Fifteen distinct people — no entry is repeated. Where the
 * V2 site used a shared description for the wider care team, that wording is
 * preserved rather than invented.
 */

export type TeamMember = {
  name: string;
  role: string;
  story: string;
  image: string;
};

const CARE_TEAM_STORY =
  "Part of the multidisciplinary team helping patients and families through recovery and rehabilitation.";

const CLINICAL_TEAM_STORY =
  "A member of Ahana's multidisciplinary care team, supporting patients and families with compassion.";

export const TEAM: readonly TeamMember[] = [
  {
    name: "Dr. Vikhram Ramasubramanian",
    role: "CEO & Consultant Psychiatrist",
    story:
      "Founder and CEO of Ahana Hospitals, with leadership experience across psychiatry, healthcare delivery and behavioural medicine.",
    image: "/assets/team/dr-vikhram.webp",
  },
  {
    name: "Dr. A. Sugaparaneetharan",
    role: "Consultant Psychiatrist",
    story:
      "Specialist in addiction medicine with interests in adolescent psychiatry, psychosexual health and public education.",
    image: "/assets/team/dr-sugaparaneetharan.webp",
  },
  {
    name: "Dr. G. Padmini",
    role: "Consultant Psychiatrist",
    story:
      "Experienced psychiatrist whose core areas include community psychiatry and adult psychiatry.",
    image: "/assets/team/dr-padmini-real.webp",
  },
  {
    name: "Mrs. Bijulakshmi",
    role: "Consultant Psychologist",
    story:
      "Experienced counsellor supporting people with anxiety, depression, OCD and interpersonal concerns.",
    image: "/assets/team/mrs-bijulakshmi.webp",
  },
  {
    name: "Dr. Alice",
    role: "Mental Health Professional",
    story: CLINICAL_TEAM_STORY,
    image: "/assets/team/dr-alice.webp",
  },
  {
    name: "Dr. Gautami",
    role: "Mental Health Professional",
    story: CLINICAL_TEAM_STORY,
    image: "/assets/team/dr-gautami.webp",
  },
  {
    name: "Dr. Janet",
    role: "Mental Health Professional",
    story: CLINICAL_TEAM_STORY,
    image: "/assets/team/dr-janet.webp",
  },
  {
    name: "Dr. Sabrin",
    role: "Mental Health Professional",
    story: CLINICAL_TEAM_STORY,
    image: "/assets/team/dr-sabrin.webp",
  },
  {
    name: "Mr. Gopi",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/mr-gopi.webp",
  },
  {
    name: "Mr. Inbasekarapandian",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/mr-inbasekarapandian.webp",
  },
  {
    name: "Mr. Jegadeesh",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/mr-jegadeesh.webp",
  },
  {
    name: "Mr. Vikash",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/mr-vikash.webp",
  },
  {
    name: "Mrs. Guruvammal",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/mrs-guruvammal.webp",
  },
  {
    name: "Ms. Anjana",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/ms-anjana.webp",
  },
  {
    name: "Ms. Karpagam",
    role: "Care Team",
    story: CARE_TEAM_STORY,
    image: "/assets/team/ms-karpagam.webp",
  },
] as const;
