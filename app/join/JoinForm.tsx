"use client";

import { useFormState, useFormStatus } from "react-dom";

import { joinWila } from "./actions";
import { HAAS_PROGRAMS } from "@/lib/types";

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
      {pending ? "Sending…" : "Become a member"}
    </button>
  );
}

export default function JoinForm() {
  const [state, formAction] = useFormState(joinWila, {});

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-california-gold/30 bg-california-gold/10 p-8 md:p-10">
        <h2 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-white">
          You are on the list
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
          Thank you. A board member will check your details and add you to the
          mailing list. You will hear from us before the next event.
        </p>
        <a
          href="/"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-california-gold transition hover:text-white"
        >
          Back to the site
        </a>
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

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <Label>Full name</Label>
          <input className={field} name="name" required autoComplete="name" placeholder="Jane Doe" />
        </label>
        <label className="block">
          <Label>Email</Label>
          <input
            className={field}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <Label hint="four digits">Graduation year</Label>
          <input
            className={field}
            name="gradYear"
            inputMode="numeric"
            required
            placeholder="2018"
            maxLength={4}
          />
        </label>
        <label className="block">
          <Label>Program</Label>
          <select className={field} name="program" required defaultValue="">
            <option value="" disabled>
              Choose your program
            </option>
            {HAAS_PROGRAMS.map((p) => (
              <option key={p} value={p} className="text-ink">
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <Label hint="this is how we verify you">LinkedIn profile</Label>
        <input
          className={field}
          name="linkedin"
          type="url"
          required
          placeholder="https://www.linkedin.com/in/yourname"
        />
      </label>

      <p className="text-xs leading-relaxed text-white/45">
        We use your LinkedIn profile to confirm you studied at Berkeley Haas.
        Your details are only used to send WILA news and event invitations, and
        are never shared outside the board.
      </p>

      <Submit />
    </form>
  );
}
