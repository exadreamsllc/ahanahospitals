import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import styles from "./AuthShell.module.css";

export type AuthShellProps = {
  children: ReactNode;
};

/**
 * Centred page frame for every authentication screen. Always renders the
 * signed-out header — an authenticated visitor is redirected away from these
 * routes before they render.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className={styles.shell}>
      <a className="ahana-skip-link" href="#main-content">
        Skip to main content
      </a>

      <AppHeader isAuthenticated={false} />

      <main id="main-content" className={styles.main}>
        <div className={styles.inner}>{children}</div>
      </main>

      <AppFooter />
    </div>
  );
}
