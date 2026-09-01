"use client";

import { useFormState, useFormStatus } from "react-dom";

import { changeOwnPassword } from "../actions";
import { TextField, FormError, FormNotice } from "@/components/admin/Field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-berkeley-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
    >
      {pending ? "Updating…" : "Update password"}
    </button>
  );
}

export default function ChangePasswordForm() {
  const [state, formAction] = useFormState(changeOwnPassword, {});

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state?.error} />
      <FormNotice message={state?.ok} />

      <TextField
        name="current"
        label="Current password"
        type="password"
        required
      />
      <TextField
        name="next"
        label="New password"
        hint="at least 8 characters"
        type="password"
        required
      />
      <TextField
        name="confirm"
        label="Confirm new password"
        type="password"
        required
      />

      <SubmitButton />
    </form>
  );
}
