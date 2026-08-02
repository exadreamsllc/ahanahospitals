import type { SelectHTMLAttributes } from "react";
import styles from "./Field.module.css";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "children"
> & {
  label: string;
  name: string;
  options: readonly SelectOption[];
  error?: string;
  hint?: string;
};

/**
 * A labelled native `<select>`. The native control is used deliberately —
 * it is keyboard accessible, screen-reader friendly, and works well with
 * mobile pickers without any JavaScript.
 */
export function SelectField({
  label,
  name,
  id,
  options,
  error,
  hint,
  ...selectProps
}: SelectFieldProps) {
  const fieldId = id ?? name;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
      </label>

      <select
        {...selectProps}
        id={fieldId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${styles.control} ${styles.select} ${
          error ? styles.invalid : ""
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
