"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/app/auth/forgot-password/actions";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { FormField } from "@/components/ui/FormField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    EMPTY_FORM_STATE
  );

  return (
    <form action={formAction}>
      {state.message ? (
        <AlertMessage variant="error" title="We could not send the email">
          <p>{state.message}</p>
        </AlertMessage>
      ) : null}

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
        hint="Enter the address you registered with."
      />

      <LoadingButton pendingLabel="Sending reset link…">
        Send reset link
      </LoadingButton>
    </form>
  );
}
