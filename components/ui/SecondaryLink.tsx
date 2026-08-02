import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Button.module.css";

export type SecondaryLinkProps = {
  href: string;
  children: ReactNode;
  /** `text` renders an inline underlined link, `button` a bordered button. */
  appearance?: "text" | "button";
  fullWidth?: boolean;
  /** Set when linking off-site; adds the matching rel attributes. */
  external?: boolean;
};

/**
 * Navigational link styled to sit alongside the buttons. Uses `next/link` so
 * client-side navigation and prefetching still apply.
 */
export function SecondaryLink({
  href,
  children,
  appearance = "text",
  fullWidth = false,
  external = false,
}: SecondaryLinkProps) {
  const classNames =
    appearance === "button"
      ? [styles.button, styles.secondary, fullWidth ? styles.fullWidth : ""]
          .filter(Boolean)
          .join(" ")
      : styles.link;

  if (external) {
    return (
      <a
        href={href}
        className={classNames}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}
