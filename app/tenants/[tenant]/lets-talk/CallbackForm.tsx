"use client";

import { useActionState } from "react";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { submitCallbackRequestAction } from "@/lib/actions/contact";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";

const PREFERRED_TIME_OPTIONS = [
  { value: "morning", label: "Morning (9:00 AM – 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM – 4:00 PM)" },
  { value: "evening", label: "Evening (4:00 PM – 7:00 PM)" },
] as const;

const CONTACT_CHANNEL_OPTIONS = [
  { value: "phone", label: "Phone Call" },
  { value: "whatsapp", label: "WhatsApp Message" },
] as const;

export type CallbackFormProps = {
  initialName?: string;
};

export function CallbackForm({ initialName = "" }: CallbackFormProps) {
  const [state, formAction] = useActionState(submitCallbackRequestAction, EMPTY_FORM_STATE);
  const success = state.message === "success";
  const submittedValues = success ? state.values : undefined;

  if (success && submittedValues) {
    const waText = encodeURIComponent(
      `Hi Ahana Hospitals team, my name is ${submittedValues.fullName}. I just requested a confidential callback on the member portal (preferred channel: WhatsApp).`
    );
    const waUrl = `https://wa.me/919006006000?text=${waText}`;

    return (
      <div className="ahana-card" style={{ maxWidth: "560px", width: "100%", margin: "0 auto" }}>
        <AlertMessage variant="success" title="Request submitted successfully">
          <p>
            Thank you, <strong>{submittedValues.fullName}</strong>! A care coordinator has received your request and will contact you via {submittedValues.contactChannel === "whatsapp" ? "WhatsApp" : "Phone Call"} during your preferred time.
          </p>
        </AlertMessage>

        {submittedValues.contactChannel === "whatsapp" && (
          <div className="ahana-stack" style={{ marginTop: "var(--ahana-space-6)", gap: "var(--ahana-space-3)" }}>
            <h3 style={{ margin: 0, color: "var(--ahana-purple-dark)" }}>Immediate Connect</h3>
            <p style={{ margin: 0, color: "var(--ahana-muted)" }}>
              To skip the queue, you can start a chat directly on WhatsApp right now with our helpdesk:
            </p>
            <p style={{ margin: 0 }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="Button-module__VMVMAW__button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#25D366",
                  color: "#fff",
                  border: "none",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  borderRadius: "var(--ahana-radius-pill)",
                  textDecoration: "none"
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.896 0c3.181.001 6.171 1.242 8.423 3.497 2.253 2.253 3.491 5.244 3.491 8.417-.003 6.578-5.328 11.902-11.896 11.902-2.003-.001-3.974-.509-5.727-1.477L0 24zm6.59-4.846c1.62.962 3.238 1.488 4.887 1.489 5.378 0 9.752-4.37 9.755-9.743.001-2.602-1.012-5.05-2.854-6.892-1.842-1.842-4.29-2.854-6.892-2.855-5.38 0-9.755 4.373-9.758 9.748-.001 1.761.472 3.483 1.371 5.017L1.13 21.614l5.517-1.46zm12.393-5.267c-.314-.157-1.855-.916-2.138-1.018-.282-.102-.489-.153-.69.153-.201.306-.778.98-.953 1.183-.176.204-.351.229-.665.072-1.02-.511-1.785-.826-2.483-1.424-.437-.375-.716-.838-.802-.984-.087-.147-.009-.226.065-.3l.711-.71c.075-.075.101-.126.151-.21.05-.084.025-.159-.012-.234-.038-.075-.489-1.183-.69-1.67-.195-.47-.39-.407-.538-.415-.138-.007-.297-.008-.456-.008-.159 0-.418.06-.637.299-.219.239-.837.818-.837 1.996 0 1.178.857 2.316.976 2.475.12.159 1.688 2.578 4.09 3.619.571.248 1.018.396 1.366.507.574.182 1.096.157 1.507.096.459-.068 1.855-.758 2.116-1.458.261-.7.261-1.3.183-1.424-.078-.124-.282-.204-.596-.361z"/>
                </svg>
                Start Chat on WhatsApp
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="ahana-card" style={{ maxWidth: "560px", width: "100%", margin: "0 auto" }}>
      <h2 style={{ marginTop: 0, color: "var(--ahana-purple-dark)" }}>Request a Callback</h2>
      <p style={{ color: "var(--ahana-muted)" }}>
        Fill out this secure form and a member of the Ahana care team will reach out to you.
      </p>

      {state.message && state.message !== "success" && (
        <div style={{ marginBottom: "var(--ahana-space-4)" }}>
          <AlertMessage variant="error" title="Submission failed">
            <p>{state.message}</p>
          </AlertMessage>
        </div>
      )}

      <form action={formAction} className="ahana-stack" style={{ gap: "var(--ahana-space-4)" }}>
        <FormField
          label="Your Name"
          name="fullName"
          placeholder="e.g. Aditi Sharma"
          defaultValue={state.values?.fullName ?? initialName}
          error={state.fieldErrors.fullName}
          required
        />

        <FormField
          label="Contact Number"
          name="phoneNumber"
          type="tel"
          placeholder="e.g. 9876543210"
          defaultValue={state.values?.phoneNumber ?? ""}
          error={state.fieldErrors.phoneNumber}
          required
          hint="Must be a 10 to 12 digit phone number. Standard formatting is accepted."
        />

        <SelectField
          label="Preferred Time Slot"
          name="preferredTime"
          options={PREFERRED_TIME_OPTIONS}
          defaultValue={state.values?.preferredTime ?? "morning"}
          error={state.fieldErrors.preferredTime}
        />

        <SelectField
          label="Preferred Contact Channel"
          name="contactChannel"
          options={CONTACT_CHANNEL_OPTIONS}
          defaultValue={state.values?.contactChannel ?? "phone"}
          error={state.fieldErrors.contactChannel}
        />

        <div style={{ marginTop: "var(--ahana-space-2)" }}>
          <LoadingButton pendingLabel="Submitting request…">
            Request Callback
          </LoadingButton>
        </div>
      </form>
    </section>
  );
}
