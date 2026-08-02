import Image from "next/image";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { WelcomeVideo } from "./WelcomeVideo";
import { ACCREDITATION, CONTACT } from "@/lib/content/contact";
import { ROUTES } from "@/lib/constants/site";
import styles from "./Hero.module.css";

/** Homepage hero: welcome video alongside the headline and primary actions. */
export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={`ahana-container ${styles.grid}`}>
        <WelcomeVideo />

        <div className={styles.copy}>
          <span className="ahana-eyebrow">A gentle first step</span>
          <h1 className={`ahana-display ${styles.title}`}>
            Your brain is an organ too. It deserves specialist care.
          </h1>
          <p className={styles.lede}>
            Mental health deserves the same care and respect as physical health.
            Reaching out is a sign of strength — and you do not have to take the
            first step alone.
          </p>

          <div className={styles.actions}>
            <SecondaryLink href={ROUTES.letsTalk} appearance="button">
              Request a confidential callback
            </SecondaryLink>
            <a className={styles.callLink} href={CONTACT.phoneHref}>
              Call {CONTACT.phoneDisplay}
            </a>
          </div>

          <p className={styles.accreditation}>
            <Image
              src="/assets/nabh.webp"
              alt="NABH accreditation"
              width={500}
              height={273}
              className={styles.nabh}
            />
            <span>{ACCREDITATION}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
