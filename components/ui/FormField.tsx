import type { InputHTMLAttributes } from "react";
import styles from "./Field.module.css";

export type FormFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  /** Visible label text. Never omit — placeholder-only fields are not accessible. */
  label: string;
  name: string;
  /** Field-level validation message returned by the server action. */
  error?: string;
  /** Supporting text, e.g. password requirements. */
  hint?: string;
  /** Renders a subtle "(optional)" marker next to the label. */
  optional?: boolean;
};

/**
 * A labelled text input wired for assistive technology:
 * `aria-invalid` on failure and `aria-describedby` pointing at the hint and
 * error nodes so screen readers announce both.
 */
export function FormField({
  label,
  name,
  id,
  error,
  hint,
  optional = false,
  required,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? name;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </label>

      <input
        {...inputProps}
        id={fieldId}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${styles.control} ${error ? styles.invalid : ""}`}
      />

      {hint ? (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p className={styles.error} id={errorId}>
          <span aria-hidden="true" className={styles.errorIcon}>
            &#9888;
          </span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
