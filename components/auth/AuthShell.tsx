import type { ReactNode } from "react";
import Image from "next/image";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import styles from "./AuthShell.module.css";

export type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className={styles.shell}>
      <a className="ahana-skip-link" href="#main-content">
        Skip to main content
      </a>

      <AppHeader isAuthenticated={false} />

      <main id="main-content" className={styles.main}>
        <div className={styles.container}>
          {/* Branded hero section on the left */}
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <h2 className={styles.heroTitle}>
                Experience The Exceptional Care With The Finest Hospitality
              </h2>
              <div className={styles.imageWrapper}>
                <Image
                  src="/assets/family.webp"
                  alt="Ahana Hospitals Family Care"
                  width={500}
                  height={380}
                  className={styles.heroImage}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Login/Auth form on the right */}
          <div className={styles.formContainer}>{children}</div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
