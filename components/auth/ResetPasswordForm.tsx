"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth/reset-password";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { FormField } from "@/components/ui/FormField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { EMPTY_FORM_STATE, MIN_PASSWORD_LENGTH } from "@/lib/validation/auth";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(
    resetPasswordAction,
    EMPTY_FORM_STATE
  );

  return (
    <form action={formAction}>
      {state.message ? (
        <AlertMessage variant="error" title="We could not update your password">
          <p>{state.message}</p>
        </AlertMessage>
      ) : null}

      <FormField
        label="New password"
        name="password"
        type="password"
        required
        minLength={MIN_PASSWORD_LENGTH}
        autoComplete="new-password"
        error={state.fieldErrors.password}
        hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
      />

      <FormField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        required
        minLength={MIN_PASSWORD_LENGTH}
        autoComplete="new-password"
        error={state.fieldErrors.confirmPassword}
      />

      <LoadingButton pendingLabel="Updating your password…">
        Update password
      </LoadingButton>
    </form>
  );
}
