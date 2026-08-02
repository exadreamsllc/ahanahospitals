/** The six care services, as approved on the Ahana V2 site. */

export type Service = {
  number: string;
  title: string;
  description: string;
  action: string;
};

export const SERVICES: readonly Service[] = [
  {
    number: "01",
    title: "Psychiatry",
    description:
      "Assessment and evidence-based treatment for emotional, behavioural and psychiatric concerns across age groups.",
    action: "Speak with the team",
  },
  {
    number: "02",
    title: "Psychology & counselling",
    description:
      "Confidential counselling, therapy and family support from trained psychologists and counsellors.",
    action: "Start a conversation",
  },
  {
    number: "03",
    title: "De-addiction",
    description:
      "Structured, medically supported care for alcohol, tobacco and substance-use concerns.",
    action: "Ask about treatment",
  },
  {
    number: "04",
    title: "Rehabilitation",
    description:
      "Psychosocial rehabilitation, daily-living support and pathways back to family, community and work.",
    action: "Explore rehabilitation",
  },
  {
    number: "05",
    title: "Child & adolescent care",
    description:
      "Support for behaviour, learning, attention, development, mood and family concerns.",
    action: "Talk about your child",
  },
  {
    number: "06",
    title: "Family guidance",
    description:
      "Practical guidance for caregivers who need clarity, reassurance and a plan for the next step.",
    action: "Get family support",
  },
] as const;
