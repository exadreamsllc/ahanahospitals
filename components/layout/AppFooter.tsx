import Link from "next/link";
import {
  NO_MEDICAL_RECORDS_NOTICE,
  ROUTES,
  SITE_NAME,
} from "@/lib/constants/site";
import styles from "./AppFooter.module.css";

/**
 * Site footer. Repeats the clinical-data boundary on every page so the
 * limitation is never more than one screen away.
 */
export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`ahana-container ${styles.inner}`}>
        <div>
          <span className={styles.brandName}>{SITE_NAME}</span>
          <p className={styles.tagline}>
            A Unit of the M.S. Chellamuthu Trust & Research Foundation.
            Helping touch, heal, and rehabilitate lives in Madurai since 1992.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className={styles.linkList}>
            <li>
              <Link href={ROUTES.resources} className={styles.link}>
                Resources
              </Link>
            </li>
            <li>
              <Link href={ROUTES.privacy} className={styles.link}>
                Privacy Notice
              </Link>
            </li>
            <li>
              <Link href={ROUTES.terms} className={styles.link}>
                Terms of Use
              </Link>
            </li>
          </ul>
        </nav>

        <p className={styles.boundary}>{NO_MEDICAL_RECORDS_NOTICE}</p>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
