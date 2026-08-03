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
            eyebrow="Message from our Founder"
            title="You are in Good Hands"
            id="speech-heading"
          />

          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="A Message of Reassurance from our Founder"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className={styles.speechContent}>
            <h3 className={styles.speechTitle}>Message Transcript</h3>
            <p>
              &ldquo;At Ahana Hospitals, our commitment has always been to build a sanctuary of recovery, dignity, and healing. A hospital is not merely a structure of bricks and clinical equipment &mdash; it is a living community defined by the hands that care for you.
            </p>
            <p>
              When you or your loved ones walk through our gates, I want you to know with absolute certainty: <strong>you are in good hands.</strong>&rdquo;
            </p>

            <ul className={styles.staffList}>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>1. Our Doctors & Psychiatrists</span>
                Stand at the forefront of medical excellence, charting path-breaking clinical guidelines and evidence-based protocols to restore balance and clinical stability.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>2. Our Psychologists & Therapists</span>
                Provide a deep, empathetic space for cognitive healing, helping you unpack trauma, navigate anxiety, and rebuild emotional resilience.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>3. Our Nurses & Care Providers</span>
                Represent the heartbeat of Ahana, offering round-the-clock physical assistance, administering medications, and providing warm bedside comfort.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>4. Our Housekeeping & Kitchen Staff</span>
                Work tirelessly behind the scenes to maintain a pristine, sanitized, and comfortable environment while serving nutritious, home-cooked meals.
              </li>
              <li className={styles.staffItem}>
                <span className={styles.staffRole}>5. Our Security Team</span>
                Maintain a peaceful, protected, and welcoming campus sanctuary 24/7, ensuring that you can focus entirely on your path to recovery.
              </li>
            </ul>

            <p>
              &ldquo;Together, we operate as one united family, dedicated to guiding you and your family back to a life of health, meaning, and belonging.&rdquo;
            </p>
          </div>
        </section>
      </div>
    </MemberShell>
  );
}
