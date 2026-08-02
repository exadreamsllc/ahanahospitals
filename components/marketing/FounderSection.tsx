import Image from "next/image";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";
import styles from "./FounderSection.module.css";

/** Founder / "our promise" panel linking through to the founder page. */
export function FounderSection() {
  return (
    <section className="ahana-section" id="founder" aria-labelledby="founder-heading">
      <div className="ahana-container">
        <div className={`ahana-panel ${styles.panel}`}>
          <div>
            <span className="ahana-eyebrow">Our promise</span>
            <h2 id="founder-heading" className={`ahana-display ${styles.title}`}>
              From our family to yours
            </h2>
            <p className={styles.body}>
              Ahana was built on a simple belief: every person deserves to be
              heard, treated with dignity and supported beyond the hospital
              walls. We combine clinical care with rehabilitation, family
              involvement and community participation.
            </p>

            <div className={styles.actions}>
              <SecondaryLink href={ROUTES.founder} appearance="button">
                Read our founder&apos;s story
              </SecondaryLink>
              <SecondaryLink href={ROUTES.letsTalk}>Talk with us</SecondaryLink>
            </div>
          </div>

          <div className={styles.photo}>
            <Image
              src="/assets/family.webp"
              alt="Illustrative image representing family-centred mental-health care"
              width={1000}
              height={764}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
