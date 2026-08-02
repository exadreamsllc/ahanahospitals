"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/auth/register/actions";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { FormField } from "@/components/ui/FormField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { SelectField } from "@/components/ui/SelectField";
import {
  ACCOUNT_TYPES,
  DEFAULT_ACCOUNT_TYPE,
  DEFAULT_PREFERRED_LANGUAGE,
  PREFERRED_LANGUAGES,
  ROUTES,
} from "@/lib/constants/site";
import { EMPTY_FORM_STATE, MIN_PASSWORD_LENGTH } from "@/lib/validation/auth";

/**
 * Registration form.
 *
 * Validation runs on the server; the HTML constraints here are a fast first
 * pass only. Values the user typed are echoed back from the action state so a
 * rejected submission does not clear the form — passwords are never echoed.
 */
export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, EMPTY_FORM_STATE);

  return (
    <form action={formAction} noValidate={false}>
      {state.message ? (
        <AlertMessage variant="error" title="We could not create your account">
          <p>{state.message}</p>
        </AlertMessage>
      ) : null}

      <FormField
        label="Full name"
        name="fullName"
        type="text"
        required
        autoComplete="name"
        maxLength={120}
        defaultValue={state.values?.fullName ?? ""}
        error={state.fieldErrors.fullName}
      />

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
        hint="We will send a confirmation link to this address."
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        required
        minLength={MIN_PASSWORD_LENGTH}
        autoComplete="new-password"
        error={state.fieldErrors.password}
        hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
      />

      <FormField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        required
        minLength={MIN_PASSWORD_LENGTH}
        autoComplete="new-password"
        error={state.fieldErrors.confirmPassword}
      />

      <SelectField
        label="Preferred language"
        name="preferredLanguage"
        options={PREFERRED_LANGUAGES}
        defaultValue={state.values?.preferredLanguage ?? DEFAULT_PREFERRED_LANGUAGE}
        error={state.fieldErrors.preferredLanguage}
      />

      <SelectField
        label="Account type"
        name="accountType"
        options={ACCOUNT_TYPES}
        defaultValue={state.values?.accountType ?? DEFAULT_ACCOUNT_TYPE}
        error={state.fieldErrors.accountType}
        hint="This helps us tailor the resources we show you. It does not change your access."
      />

      <CheckboxField
        name="acceptedTerms"
        required
        error={state.fieldErrors.acceptedTerms}
      >
        I agree to Ahana&apos;s{" "}
        <Link href={ROUTES.privacy}>Privacy Notice</Link> and{" "}
        <Link href={ROUTES.terms}>Terms of Use</Link>.
      </CheckboxField>

      <LoadingButton pendingLabel="Creating your account…">
        Create account
      </LoadingButton>
    </form>
  );
}
