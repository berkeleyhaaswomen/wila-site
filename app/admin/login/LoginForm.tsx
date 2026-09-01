"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "../actions";
import { FormError } from "@/components/admin/Field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-berkeley-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink " +
  "outline-none transition focus:border-berkeley-blue focus:ring-2 focus:ring-berkeley-blue/20";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState(signIn, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <FormError message={state?.error} />

      <label className="block">
        <span className="text-sm font-semibold text-ink">Email</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-ink">Password</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      <SubmitButton />
    </form>
  );
}
