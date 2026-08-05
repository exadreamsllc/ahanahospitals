import type { Metadata } from "next";
import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { getCurrentUser } from "@/lib/auth/guards";
import {
  DEMO_JOURNEY,
  FUTURE_MODULES,
  PRODUCT_MODULES,
} from "@/lib/content/product";
import { NO_MEDICAL_RECORDS_NOTICE, ROUTES } from "@/lib/constants/site";
import styles from "./product-overview.module.css";

export const metadata: Metadata = {
  title: "Clinical Workspaces & Portals",
  description:
    "What the Ahana Hospitals platform does today — public website, patient identity, clinical consoles, Knowledge Centre resources, and intake channels.",
};

export default async function ProductOverviewPage() {
  const user = await getCurrentUser();

  return (
    <MemberShell
      title="Clinical Workspaces & Portals"
      description="What the Ahana Hospitals platform does today, and what is coming next."
      isAuthenticated={Boolean(user)}
    >
      <div className={styles.stack}>
        <section className={`ahana-panel ${styles.intro}`}>
          <p className={styles.introLede}>
            Ahana V3 has two halves. A <strong>public website</strong> anyone can
            read, and a <strong>member area</strong> for people who want to save
            what they find and come back to it.
          </p>
          <p className="ahana-muted">{NO_MEDICAL_RECORDS_NOTICE}</p>
        </section>

        {/* Live modules ------------------------------------------------- */}
        <section aria-labelledby="live-heading">
          <SectionHeading
            eyebrow="Available today"
            title="What is built"
            id="live-heading"
          />

          <ul className={`ahana-list-reset ${styles.moduleGrid}`}>
            {PRODUCT_MODULES.map((module) => (
              <li key={module.id} className={styles.module}>
                <div className={styles.moduleHead}>
                  <h3 className={styles.moduleName}>{module.name}</h3>
                  <span className={styles.liveBadge}>Live</span>
                </div>

                <p className={styles.moduleSummary}>{module.summary}</p>
                <p className={styles.moduleDetail}>{module.detail}</p>

                {module.capabilities.length > 0 ? (
                  <ul className={styles.capabilities}>
                    {module.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                ) : null}

                {module.href ? (
                  <SecondaryLink href={module.href}>
                    Open {module.name}
                  </SecondaryLink>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        {/* Future modules ----------------------------------------------- */}
        <section aria-labelledby="soon-heading">
          <SectionHeading
            eyebrow="On the roadmap"
            title="Coming soon"
            id="soon-heading"
            description={
              <p>
                These are planned, not built. They are listed so the shape of
                the platform is clear from the start.
              </p>
            }
          />

          <ul className={`ahana-list-reset ${styles.soonGrid}`}>
            {FUTURE_MODULES.map((module) => (
              <li key={module.id} className={styles.soonCard}>
                <div className={styles.moduleHead}>
                  <h3 className={styles.soonName}>{module.name}</h3>
                  <span className={styles.soonBadge}>Coming soon</span>
                </div>
                <p className={styles.moduleSummary}>{module.summary}</p>
                <p className={styles.moduleDetail}>{module.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Demo journey -------------------------------------------------- */}
        <section aria-labelledby="journey-heading">
          <SectionHeading
            eyebrow="Guided tour"
            title="See it in eight steps"
            id="journey-heading"
            description={
              <p>
                Follow this order for the clearest picture of how the platform
                fits together.
              </p>
            }
          />

          <ol className={`ahana-list-reset ${styles.journey}`}>
            {DEMO_JOURNEY.map((stop) => (
              <li key={stop.step} className={styles.journeyItem}>
                <span aria-hidden="true" className={styles.journeyNumber}>
                  {stop.step}
                </span>
                <div className={styles.journeyBody}>
                  <Link href={stop.href} className={styles.journeyLink}>
                    {stop.label}
                  </Link>
                  <p className={styles.journeyNote}>{stop.note}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className={styles.journeyStart}>
            <SecondaryLink href={ROUTES.home} appearance="button">
              Start the tour
            </SecondaryLink>
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
