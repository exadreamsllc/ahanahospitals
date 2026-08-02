"use client";

import { useFormStatus } from "react-dom";
import { PrimaryButton, type ButtonVariant } from "./PrimaryButton";
import styles from "./Button.module.css";

export type LoadingButtonProps = {
  children: React.ReactNode;
  /** Announced and displayed while the server action is in flight. */
  pendingLabel?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

/**
 * Submit button that reflects the enclosing form's pending state.
 *
 * Must be rendered inside the `<form>` it submits — `useFormStatus` reads
 * context from the nearest form ancestor. Disabling during submission also
 * prevents duplicate account creation from double clicks.
 */
export function LoadingButton({
  children,
  pendingLabel = "Please wait…",
  variant = "primary",
  fullWidth = true,
}: LoadingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <PrimaryButton
      type="submit"
      variant={variant}
      fullWidth={fullWidth}
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <span aria-hidden="true" className={styles.spinner} />
          <span>{pendingLabel}</span>
        </>
      ) : (
        children
      )}
    </PrimaryButton>
  );
}
