import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { requireUser } from "@/lib/auth/guards";
import { readAccountMetadata } from "@/lib/auth/user";
import { NO_MEDICAL_RECORDS_NOTICE, ROUTES } from "@/lib/constants/site";
import { FOUNDER } from "@/lib/content/founder";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Ahana Hospitals member dashboard.",
  robots: { index: false, follow: false },
};

/** Cards for features arriving in a later release. */
const COMING_SOON = [
  {
    title: "Saved resources",
    description:
      "Keep any brochure, story or video and find it again in My Library.",
  },
  {
    title: "Reading progress",
    description: "Pick up longer stories exactly where you stopped reading.",
  },
  {
    title: "Tamil interface",
    description:
      "Read the portal itself in Tamil, not only the resources within it.",
  },
  {
    title: "Profile editing",
    description: "Update your name, language and preferences yourself.",
  },
] as const;

export default async function DashboardPage() {
  const user = await requireUser(ROUTES.dashboard);
  const account = readAccountMetadata(user);

  const greetingName = account.fullName ?? account.email ?? "there";

  return (
    <MemberShell
      title={`Welcome, ${greetingName}`}
      description="Your member area — the Ahana archive, the resources you save, and your account preferences."
    >
      <div className={styles.layout}>
        {/* Continue reading -------------------------------------------- */}
        <section aria-labelledby="continue-heading">
          <h2 id="continue-heading" className={styles.sectionTitle}>
            Continue reading
          </h2>

          <Link href={ROUTES.story365} className={styles.continueCard}>
            <div className={styles.continueMedia}>
              <Image
                src="/assets/365/hero.jpg"
                alt=""
                width={1351}
                height={1800}
                className={styles.continueImage}
              />
            </div>
            <div className={styles.continueBody}>
              <span className={styles.badge}>365 Days</span>
              <h3 className={styles.continueTitle}>
                365 Days of Meaningful Living
              </h3>
              <p className={styles.continueText}>
                A shared-meal initiative bringing people together with dignity,
                belonging and purpose — on ordinary days, not only on special
                occasions.
              </p>
              <span className={styles.continueAction}>
                Read the story<span aria-hidden="true"> →</span>
              </span>
            </div>
          </Link>

          <p className={styles.sectionNote}>
            Reading progress is not tracked yet — this is the latest published
            story.
          </p>
        </section>

        {/* Quick links -------------------------------------------------- */}
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className={styles.sectionTitle}>
            Explore
          </h2>

          <ul className={`ahana-list-reset ${styles.cardGrid}`}>
            <li className={styles.card}>
              <span className={styles.badge}>My Library</span>
              <h3 className={styles.cardTitle}>Your saved resources</h3>
              <p className={styles.cardText}>
                Everything you keep will collect here, ready to open again
                later.
              </p>
              <SecondaryLink href={ROUTES.library} appearance="button">
                Open My Library
              </SecondaryLink>
            </li>

            <li className={`${styles.card} ${styles.founderCard}`}>
              <span className={styles.badge}>Founder Legacy</span>
              <h3 className={styles.cardTitle}>{FOUNDER.name}</h3>
              <p className={styles.cardText}>
                The belief that shaped Ahana — biography, timeline and archive.
              </p>
              <SecondaryLink href={ROUTES.founder} appearance="button">
                Read the story
              </SecondaryLink>
            </li>

            <li className={styles.card}>
              <span className={styles.badge}>Resources</span>
              <h3 className={styles.cardTitle}>Knowledge Centre</h3>
              <p className={styles.cardText}>
                Brochures, publications, research, videos and community
                programmes.
              </p>
              <SecondaryLink href={ROUTES.resources} appearance="button">
                Browse resources
              </SecondaryLink>
            </li>
          </ul>
        </section>

        {/* Account ------------------------------------------------------ */}
        <section className={styles.account} aria-labelledby="account-heading">
          <h2 id="account-heading" className={styles.sectionTitle}>
            Your account
          </h2>

          <dl className={`ahana-definition-list ${styles.accountList}`}>
            <div>
              <dt>Email address</dt>
              <dd>{account.email ?? "Not available"}</dd>
            </div>
            <div>
              <dt>Preferred language</dt>
              <dd>{account.preferredLanguage}</dd>
            </div>
            <div>
              <dt>Account type</dt>
              <dd>{account.accountType}</dd>
            </div>
          </dl>

          <div className={styles.accountActions}>
            <SecondaryLink href={ROUTES.profile}>View full profile</SecondaryLink>
            <form action={ROUTES.signOut} method="post">
              <PrimaryButton type="submit" variant="secondary">
                Sign out
              </PrimaryButton>
            </form>
          </div>
        </section>

        {/* Coming soon -------------------------------------------------- */}
        <section aria-labelledby="soon-heading">
          <h2 id="soon-heading" className={styles.sectionTitle}>
            Coming soon
          </h2>

          <ul className={`ahana-list-reset ${styles.soonGrid}`}>
            {COMING_SOON.map((item) => (
              <li key={item.title} className={styles.soonCard}>
                <h3 className={styles.soonTitle}>{item.title}</h3>
                <p className={styles.soonText}>{item.description}</p>
                <span className={styles.soonBadge}>In development</span>
              </li>
            ))}
          </ul>
        </section>

        <AlertMessage variant="info" title="No medical records here">
          <p>{NO_MEDICAL_RECORDS_NOTICE}</p>
        </AlertMessage>
      </div>
    </MemberShell>
  );
}
