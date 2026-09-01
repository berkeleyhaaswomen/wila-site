"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { resetUserPassword } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-ink/70 transition hover:bg-soft-gray disabled:opacity-60"
    >
      {pending ? "Setting…" : "Set"}
    </button>
  );
}

export default function ResetPasswordForm({
  userId,
  label
}: {
  userId: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(resetUserPassword, {});

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-berkeley-blue hover:underline"
      >
        Reset password
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-1.5">
      <input type="hidden" name="id" value={userId} />
      <div className="flex items-center gap-2">
        <input
          name="password"
          type="password"
          required
          minLength={12}
          aria-label={`New password for ${label}`}
          placeholder="New password"
          className="w-36 rounded-lg border border-black/15 px-2 py-1 text-sm"
        />
        <SubmitButton />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-ink/50 hover:text-ink"
        >
          Cancel
        </button>
      </div>
      {state?.error && <p className="text-xs text-red-700">{state.error}</p>}
      {state?.ok && <p className="text-xs text-emerald-700">{state.ok}</p>}
    </form>
  );
}
