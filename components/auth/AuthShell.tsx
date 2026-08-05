"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import styles from "./AuthShell.module.css";

export type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const [activeLang, setActiveLang] = useState<"en" | "ta">("en");

  const videoSrc =
    activeLang === "en"
      ? "https://www.youtube.com/embed/WMjIftab4_U"
      : "https://www.youtube.com/embed/gT8q368T7pE";

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
              <h2 className={styles.founderTitle}>Dr. C. Ramasubramanian</h2>
              <p className={styles.founderSubtitle}>Founder, Ahana Hospitals</p>

              {/* Language Selector Tabs */}
              <div className={styles.videoTabs}>
                <button
                  type="button"
                  onClick={() => setActiveLang("en")}
                  className={`${styles.tabBtn} ${
                    activeLang === "en" ? styles.activeTab : ""
                  }`}
                >
                  English Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang("ta")}
                  className={`${styles.tabBtn} ${
                    activeLang === "ta" ? styles.activeTab : ""
                  }`}
                >
                  தமிழ் உரை (Tamil Video)
                </button>
              </div>

              {/* Video Player */}
              <div className={styles.videoWrapper}>
                <iframe
                  src={videoSrc}
                  title={
                    activeLang === "en"
                      ? "Ahana Hospitals Introduction (English)"
                      : "Ahana Hospitals Introduction (Tamil)"
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className={styles.iframe}
                />
              </div>

              <p className={styles.founderMessage}>
                Watch our founder introduce our sanctuary of recovery, dignity, and healing.
              </p>
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
