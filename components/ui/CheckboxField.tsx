import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Field.module.css";

export type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  name: string;
  /** Label content — accepts nodes so consent copy can embed links. */
  children: ReactNode;
  error?: string;
};

/**
 * A consent-style checkbox. The whole label is clickable, and the error is
 * associated through `aria-describedby` rather than colour alone.
 */
export function CheckboxField({
  name,
  id,
  children,
  error,
  ...inputProps
}: CheckboxFieldProps) {
  const fieldId = id ?? name;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={styles.checkboxField}>
      <label className={styles.checkboxLabel} htmlFor={fieldId}>
        <input
          {...inputProps}
          type="checkbox"
          id={fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={styles.checkbox}
        />
        <span>{children}</span>
      </label>

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
