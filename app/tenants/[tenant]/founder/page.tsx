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

        {/* Founder Speech & YouTube Video Embed ------------------------- */}
        <section className={styles.videoSection} aria-labelledby="speech-heading">
          <SectionHeading
            eyebrow="Introduction Video"
            title="Sanctuary of Recovery, Dignity, and Healing"
            id="speech-heading"
          />

          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube.com/embed/WMjIftab4_U"
              title="Ahana Hospitals Introduction Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className={styles.speechContent}>
            <p>
              Ahana Hospitals presents its commitment to being a sanctuary of recovery, dignity, and healing, emphasizing that a hospital is a caring community beyond buildings and equipment.
            </p>

            <h3 className={styles.speechTitle}>Clinical & Support Personas</h3>
            <ul className={styles.staffList}>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>Doctors & Psychiatrists</span>
                Guiding medical excellence and patient recovery pathways through evidence-based clinical protocols.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>Psychologists, Therapists, & Social Workers</span>
                Providing empathetic cognitive healing, behavioral counseling, and trauma rehabilitation support.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>Nurses & Care Providers</span>
                Delivering dedicated, round-the-clock physical assistance, medication management, and bedside comfort.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>Housekeeping & Kitchen Teams</span>
                Maintaining peak sanitization and hygiene while serving nutritious, home-cooked meals tailored to recovery.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>Security Staff</span>
                Ensuring a peaceful, protected, and welcoming campus sanctuary 24/7.
              </li>
            </ul>

            <h3 className={styles.speechTitle}>Video Navigation Index</h3>
            <p className="no-print" style={{ color: "var(--ahana-muted)", fontSize: "var(--ahana-font-size-sm)", marginBottom: "var(--ahana-space-2)" }}>
              Select any milestone below to open and watch that segment directly on YouTube:
            </p>
            <ul className={styles.timestampGrid}>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:00</span> Welcome to Ahana
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=9s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:09</span> More Than a Hospital
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=17s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:17</span> You Are in Good Hands
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=26s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:26</span> Clinical Excellence Team
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=38s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:38</span> Therapy and Resilience
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=50s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:50</span> Nursing Care Around Clock
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=59s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>00:59</span> Cleanliness and Nutrition
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=69s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>01:09</span> Safe Healing Campus
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=80s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>01:20</span> Branches in Madurai
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=86s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>01:26</span> One United Family
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=WMjIftab4_U&t=96s" className={styles.timestampLink} target="_blank" rel="noopener noreferrer">
                  <span className={styles.timestampBadge}>01:36</span> Thank You for Trust
                </a>
              </li>
            </ul>

            <p style={{ marginTop: "var(--ahana-space-6)" }}>
              Ahana Hospitals operates multiple specialized branches across Madurai to bring world-class psychiatric, psychological, and rehabilitation care closer to home. We thank you for trusting us with your family's care and well-being.
            </p>
          </div>
        </section>
      </div>
    </MemberShell>
  );
}
