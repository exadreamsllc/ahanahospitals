import { SectionHeading } from "./SectionHeading";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { CONTACT, EMERGENCY_NOTICE } from "@/lib/content/contact";
import { ROUTES } from "@/lib/constants/site";
import styles from "./LetsTalkSection.module.css";

/** Homepage contact panel plus the urgent-support notice. */
export function LetsTalkSection() {
  return (
    <section
      className="ahana-section"
      id="lets-talk"
      aria-labelledby="lets-talk-heading"
    >
      <div className="ahana-container">
        <div className={`ahana-panel ${styles.panel}`}>
          <div>
            <SectionHeading
              eyebrow="Confidential first conversation"
              title="Tell us what is happening. We will help you find the next step."
              id="lets-talk-heading"
              description={
                <p>
                  Call or email the Ahana team. For your privacy, please avoid
                  sharing detailed medical information through unsecured
                  messages.
                </p>
              }
            />

            <SecondaryLink href={ROUTES.letsTalk} appearance="button">
              Start a conversation
            </SecondaryLink>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Contact Ahana</h3>

            <dl className={styles.details}>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{CONTACT.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={styles.emergency} role="note">
          <h3 className={styles.emergencyTitle}>
            Concerned about someone&apos;s immediate safety?
          </h3>
          <p className={styles.emergencyBody}>
            Call Ahana directly for guidance. {EMERGENCY_NOTICE}
          </p>
          <a className={styles.emergencyAction} href={CONTACT.phoneHref}>
            Call Ahana now — {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
