import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type PrimaryButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

/**
 * The standard Ahana button. Renders a real `<button>` so keyboard activation,
 * form submission and focus order all come from the platform.
 */
export function PrimaryButton({
  variant = "primary",
  fullWidth = false,
  type = "button",
  children,
  ...buttonProps
}: PrimaryButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...buttonProps} type={type} className={classNames}>
      {children}
    </button>
  );
}
