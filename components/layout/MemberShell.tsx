import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import styles from "./MemberShell.module.css";

export type MemberShellProps = {
  /** Page heading rendered as the single `<h1>`. */
  title: string;
  /** Short supporting line under the heading. */
  description?: string;
  children: ReactNode;
  /** Public pages reuse this shell with the signed-out header. */
  isAuthenticated?: boolean;
};

/**
 * Page frame for member and content pages: header, skip link, main landmark
 * and footer. Pages supply only their body content, which keeps the heading
 * hierarchy consistent across the app.
 */
export function MemberShell({
  title,
  description,
  children,
  isAuthenticated = true,
}: MemberShellProps) {
  return (
    <div className={styles.shell}>
      <a className="ahana-skip-link" href="#main-content">
        Skip to main content
      </a>

      <AppHeader isAuthenticated={isAuthenticated} />

      <main id="main-content" className={styles.main}>
        <div className="ahana-container">
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>

          {children}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
