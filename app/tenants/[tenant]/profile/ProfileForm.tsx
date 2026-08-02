"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AlertMessage } from "@/components/ui/AlertMessage";
import {
  ACCOUNT_TYPES,
  PREFERRED_LANGUAGES,
  type AccountType,
  type PreferredLanguage,
} from "@/lib/constants/site";
import { EMPTY_FORM_STATE, type FormState } from "@/lib/validation/auth";

type ProfileFormProps = {
  initialFullName: string;
  initialEmail: string;
  initialEmailConfirmed: boolean;
  initialPreferredLanguage: PreferredLanguage;
  initialAccountType: AccountType;
  initialJoinedDate: string | null;
};

export function ProfileForm({
  initialFullName,
  initialEmail,
  initialEmailConfirmed,
  initialPreferredLanguage,
  initialAccountType,
  initialJoinedDate,
}: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use a custom action wrapper to handle transitions cleanly without useEffect or mutations
  const [state, formAction] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const result = await updateProfileAction(prevState, formData);
      if (
        result.message &&
        Object.keys(result.fieldErrors).length === 0 &&
        !result.message.toLowerCase().includes("failed") &&
        !result.message.toLowerCase().includes("error")
      ) {
        setIsEditing(false);
        setSuccessMessage(result.message);
      }
      return result;
    },
    EMPTY_FORM_STATE
  );

  const [editSession, setEditSession] = useState(0);

  const handleStartEdit = () => {
    setIsEditing(true);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Incrementing editSession forces the form elements to rebuild and clear errors
    setEditSession((prev) => prev + 1);
  };

  const showErrors = isEditing && state.message && Object.keys(state.fieldErrors).length === 0;

  if (isEditing) {
    return (
      <form key={editSession} action={formAction} className="ahana-card">
        <h2 id="edit-details-heading">Edit account details</h2>

        {showErrors ? (
          <AlertMessage variant="error" title="We could not update your profile">
            <p>{state.message}</p>
          </AlertMessage>
        ) : null}

        <FormField
          label="Full name"
          name="fullName"
          type="text"
          required
          maxLength={120}
          defaultValue={state.values?.fullName ?? initialFullName}
          error={state.fieldErrors.fullName}
        />

        <SelectField
          label="Preferred language"
          name="preferredLanguage"
          options={PREFERRED_LANGUAGES}
          defaultValue={state.values?.preferredLanguage ?? initialPreferredLanguage}
          error={state.fieldErrors.preferredLanguage}
        />

        <SelectField
          label="Account type"
          name="accountType"
          options={ACCOUNT_TYPES}
          defaultValue={state.values?.accountType ?? initialAccountType}
          error={state.fieldErrors.accountType}
        />

        <div
          style={{
            display: "flex",
            gap: "var(--ahana-space-3)",
            marginTop: "var(--ahana-space-6)",
          }}
        >
          <LoadingButton pendingLabel="Saving changes…" fullWidth={false}>
            Save changes
          </LoadingButton>
          <PrimaryButton
            type="button"
            variant="secondary"
            fullWidth={false}
            onClick={handleCancelEdit}
          >
            Cancel
          </PrimaryButton>
        </div>
      </form>
    );
  }

  return (
    <div className="ahana-stack">
      {successMessage ? (
        <AlertMessage variant="success" title="Profile updated">
          <p>{successMessage}</p>
        </AlertMessage>
      ) : null}

      <section className="ahana-card" aria-labelledby="details-heading">
        <h2 id="details-heading">Account details</h2>

        <dl className="ahana-definition-list">
          <div>
            <dt>Full name</dt>
            <dd>{initialFullName || "Not provided"}</dd>
          </div>
          <div>
            <dt>Email address</dt>
            <dd>{initialEmail}</dd>
          </div>
          <div>
            <dt>Email confirmed</dt>
            <dd>{initialEmailConfirmed ? "Yes" : "Not yet confirmed"}</dd>
          </div>
          <div>
            <dt>Preferred language</dt>
            <dd>{initialPreferredLanguage}</dd>
          </div>
          <div>
            <dt>Account type</dt>
            <dd>{initialAccountType}</dd>
          </div>
          {initialJoinedDate ? (
            <div>
              <dt>Member since</dt>
              <dd>{initialJoinedDate}</dd>
            </div>
          ) : null}
        </dl>

        <div style={{ marginTop: "var(--ahana-space-6)" }}>
          <PrimaryButton
            type="button"
            variant="secondary"
            fullWidth={false}
            onClick={handleStartEdit}
          >
            Edit details
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
