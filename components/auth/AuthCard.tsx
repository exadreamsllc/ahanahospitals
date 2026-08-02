import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/constants/site";
import styles from "./AuthCard.module.css";

export type AuthCardProps = {
  /** Page heading — rendered as the `<h1>` for the auth screen. */
  title: string;
  description?: ReactNode;
  /** Small uppercase label above the title. Defaults to the site name. */
  eyebrow?: string;
  children: ReactNode;
  /** Cross-links such as "Already have an account?". */
  footer?: ReactNode;
};

/** The white card that holds a single authentication form. */
export function AuthCard({
  title,
  description,
  eyebrow = SITE_NAME,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      {description ? <div className={styles.description}>{description}</div> : null}

      <div className={styles.body}>{children}</div>

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </section>
  );
}
