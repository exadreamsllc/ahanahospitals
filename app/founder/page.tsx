import type { Metadata } from "next";
import Image from "next/image";
import { MemberShell } from "@/components/layout/MemberShell";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { getCurrentUser } from "@/lib/auth/guards";
import {
  FOUNDER,
  FOUNDER_BIOGRAPHY,
  FOUNDER_BIOGRAPHY_NOTE,
  FOUNDER_TIMELINE,
} from "@/lib/content/founder";
import styles from "./founder.module.css";

export const metadata: Metadata = {
  title: "Our Founder",
  description:
    "The story of Dr. C. Ramasubramanian and the founding of Ahana Hospitals.",
};

/** Placeholder blocks awaiting content from Ahana. */
const PLACEHOLDER_SECTIONS = [
  {
    id: "awards",
    title: "Awards and recognition",
    description:
      "Honours received for contributions to mental health, rehabilitation and community care will be listed here.",
    slots: 4,
    shape: "row" as const,
  },
  {
    id: "gallery",
    title: "Gallery",
    description:
      "Photographs from across the years — the hospital, community programmes and the people involved.",
    slots: 6,
    shape: "tile" as const,
  },
  {
    id: "videos",
    title: "Videos",
    description:
      "Recorded talks, interviews and awareness sessions will be collected here.",
    slots: 3,
    shape: "video" as const,
  },
];

export default async function FounderPage() {
  const user = await getCurrentUser();

  return (
    <MemberShell
      title="Our Founder"
      description="The belief that shaped Ahana, and the person behind it."
      isAuthenticated={Boolean(user)}
    >
      <div className={styles.stack}>
        {/* Profile ------------------------------------------------------ */}
        <section className={`ahana-panel ${styles.profile}`}>
          <div className={styles.portraitFrame}>
            <Image
              src={FOUNDER.portrait}
              alt={`Portrait of ${FOUNDER.name}`}
              width={720}
              height={1080}
              className={styles.portrait}
              priority
            />
          </div>

          <div>
            <span className="ahana-eyebrow">{FOUNDER.title}</span>
            <h2 className={`ahana-display ${styles.name}`}>{FOUNDER.name}</h2>
            <p className={styles.summary}>{FOUNDER.summary}</p>
            <SecondaryLink href={FOUNDER.brochureUrl} appearance="button" external>
              Read the founder profile (PDF)
            </SecondaryLink>
          </div>
        </section>

        {/* Biography ---------------------------------------------------- */}
        <section aria-labelledby="biography-heading">
          <SectionHeading
            eyebrow="Biography"
            title="From our family to yours"
            id="biography-heading"
          />

          <div className={styles.biography}>
            {FOUNDER_BIOGRAPHY.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <p className={styles.note}>{FOUNDER_BIOGRAPHY_NOTE}</p>
          </div>
        </section>

        {/* Timeline ----------------------------------------------------- */}
        <section aria-labelledby="timeline-heading">
          <SectionHeading
            eyebrow="Timeline"
            title="A life's work, in stages"
            id="timeline-heading"
            description={
              <p>
                The milestones below are in place and awaiting confirmed dates
                and detail from Ahana.
              </p>
            }
          />

          <ol className={`ahana-list-reset ${styles.timeline}`}>
            {FOUNDER_TIMELINE.map((entry) => (
              <li key={entry.title} className={styles.timelineItem}>
                <span aria-hidden="true" className={styles.timelineMarker} />
                <div className={styles.timelineBody}>
                  <span className={styles.timelinePeriod}>
                    {entry.period ?? "Date to be confirmed"}
                  </span>
                  <h3 className={styles.timelineTitle}>{entry.title}</h3>
                  <p className={styles.timelineText}>{entry.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Placeholders ------------------------------------------------- */}
        {PLACEHOLDER_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`${section.id}-heading`}>
            <SectionHeading
              eyebrow="In preparation"
              title={section.title}
              id={`${section.id}-heading`}
              description={<p>{section.description}</p>}
            />

            <ul
              className={`ahana-list-reset ${styles.placeholderGrid} ${
                styles[section.shape]
              }`}
            >
              {Array.from({ length: section.slots }, (_, index) => (
                <li key={index} className={styles.placeholder}>
                  <span className={styles.placeholderLabel}>Coming soon</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </MemberShell>
  );
}
