"use client";

import { useFormState, useFormStatus } from "react-dom";

import { nominateAlumna } from "./actions";

const field =
  "mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-[15px] text-white " +
  "outline-none transition placeholder:text-white/35 focus:border-california-gold " +
  "focus:bg-white/10 focus:ring-2 focus:ring-california-gold/30";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
        {children}
      </span>
      {hint && <span className="text-[11px] text-white/35">{hint}</span>}
    </span>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-california-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition hover:bg-white disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : "Submit nomination"}
    </button>
  );
}

export default function NominateForm() {
  const [state, formAction] = useFormState(nominateAlumna, {});

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-california-gold/30 bg-california-gold/10 p-8 md:p-10">
        <h2 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-white">
          Nomination received
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
          Thank you for putting {state.name ? state.name : "her"} forward. The
          board reviews every nomination and reaches out directly, so there is
          nothing she needs to do.
        </p>
        <div className="mt-7 flex flex-wrap gap-6">
          <a
            href="/nominate"
            className="text-sm font-semibold text-california-gold transition hover:text-white"
          >
            Nominate someone else
          </a>
          <a
            href="/"
            className="text-sm font-semibold text-white/60 transition hover:text-white"
          >
            Back to the site
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </div>
      )}

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block">
        <Label hint="the person you are nominating">Full name</Label>
        <input
          className={field}
          name="name"
          required
          maxLength={160}
          autoComplete="off"
          placeholder="Jane Doe"
        />
      </label>

      <label className="block">
        <Label hint="how the board reaches her">Email address</Label>
        <input
          className={field}
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="off"
          placeholder="jane@example.com"
        />
      </label>

      <p className="text-xs leading-relaxed text-white/45">
        We will not contact her about this nomination until the board has
        reviewed it, and her details are never shared outside the board. If
        someone else has already nominated her, yours is counted alongside
        theirs.
      </p>

      <Submit />
    </form>
  );
}
