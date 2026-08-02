import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Heading level — sections on a page below the h1 should stay at 2. */
  as?: "h2" | "h3";
  id?: string;
  align?: "left" | "center";
};

/** Eyebrow + display headline + supporting line, used across marketing pages. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  id,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${align === "center" ? styles.center : ""}`}>
      {eyebrow ? <span className="ahana-eyebrow">{eyebrow}</span> : null}
      <Tag id={id} className={`ahana-display ${styles.title}`}>
        {title}
      </Tag>
      {description ? <div className={styles.description}>{description}</div> : null}
    </div>
  );
}
