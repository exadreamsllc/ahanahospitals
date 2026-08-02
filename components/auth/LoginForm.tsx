"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/auth/login/actions";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { FormField } from "@/components/ui/FormField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";
import styles from "./LoginForm.module.css";

export type LoginFormProps = {
  /** Same-origin path to return to after signing in. Validated server-side. */
  nextPath?: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, EMPTY_FORM_STATE);

  return (
    <form action={formAction}>
      {state.message ? (
        <AlertMessage variant="error" title="We could not sign you in">
          <p>{state.message}</p>
        </AlertMessage>
      ) : null}

      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      <FormField
        label="Email address"
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        defaultValue={state.values?.email ?? ""}
        error={state.fieldErrors.email}
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        error={state.fieldErrors.password}
      />

      <div className={styles.forgot}>
        <SecondaryLink href={ROUTES.forgotPassword}>
          Forgot your password?
        </SecondaryLink>
      </div>

      <LoadingButton pendingLabel="Signing you in…">Log in</LoadingButton>
    </form>
  );
}
