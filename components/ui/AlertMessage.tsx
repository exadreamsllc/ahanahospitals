import type { ReactNode } from "react";
import styles from "./AlertMessage.module.css";

export type AlertVariant = "error" | "success" | "info";

export type AlertMessageProps = {
  variant?: AlertVariant;
  /** Optional bold heading above the message body. */
  title?: string;
  children: ReactNode;
};

const ICONS: Record<AlertVariant, string> = {
  error: "⚠", // warning sign
  success: "✓", // check mark
  info: "ℹ", // information source
};

/**
 * Status banner for form and page level messages.
 *
 * Errors use `role="alert"` (assertive) so they interrupt; success and info
 * use `role="status"` (polite) so they are announced without cutting off the
 * user. The icon is decorative and hidden from assistive technology, so the
 * meaning must always be carried by the text.
 */
export function AlertMessage({
  variant = "info",
  title,
  children,
}: AlertMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`${styles.alert} ${styles[variant]}`}
    >
      <span aria-hidden="true" className={styles.icon}>
        {ICONS[variant]}
      </span>
      <div className={styles.body}>
        {title ? <p className={styles.title}>{title}</p> : null}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
