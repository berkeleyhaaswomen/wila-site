"use client";

import { useFormState, useFormStatus } from "react-dom";

import { addUser } from "./actions";
import { TextField, SelectField, FormError } from "@/components/admin/Field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-berkeley-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
    >
      {pending ? "Adding…" : "Grant access"}
    </button>
  );
}

export default function AddUserForm() {
  const [state, formAction] = useFormState(addUser, {});

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state?.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="email" label="Email" type="email" required />
        <TextField name="name" label="Display name" hint="optional" maxLength={120} />
        <SelectField
          name="role"
          label="Role"
          required
          options={["admin", "superadmin"]}
          defaultValue="admin"
        />
        <TextField
          name="password"
          label="Temporary password"
          hint="at least 12 characters"
          type="password"
          required
        />
      </div>

      <p className="text-xs leading-relaxed text-ink/50">
        There&apos;s no invitation email — set a temporary password, share it
        with them privately (not over email if you can avoid it), and ask them to
        change it from the Account page as soon as they sign in.
      </p>

      <SubmitButton />
    </form>
  );
}
