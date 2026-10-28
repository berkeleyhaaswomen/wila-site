"use client";

import { useFormState, useFormStatus } from "react-dom";

import { joinWila } from "./actions";
import { HAAS_PROGRAMS } from "@/lib/types";
import { SITE } from "@/lib/site";

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
      {pending ? "Sending…" : "Join Our Community"}
    </button>
  );
}

export default function JoinForm() {
  const [state, formAction] = useFormState(joinWila, {});

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-california-gold/30 bg-california-gold/10 p-8 md:p-10">
        <h2 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-white">
          Welcome to the community
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
          Thank you for joining. You will hear from us about upcoming events,
          mentorship openings, and the quarterly spotlight.
        </p>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
          One more thing worth doing now: our LinkedIn group is where the
          day-to-day conversation happens.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-berkeley-blue transition hover:bg-california-gold hover:text-ink"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" />
            </svg>
            Join our LinkedIn group
          </a>
          <a
            href="/"
            className="text-sm font-semibold text-california-gold transition hover:text-white"
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

      {/* Same fields, same order, as the WILA attendee tracking sheet. */}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <Label>First name</Label>
          <input
            className={field}
            name="firstName"
            required
            autoComplete="given-name"
            placeholder="Jane"
          />
        </label>
        <label className="block">
          <Label>Last name</Label>
          <input
            className={field}
            name="lastName"
            required
            autoComplete="family-name"
            placeholder="Doe"
          />
        </label>
      </div>

      <label className="block">
        <Label>Email address</Label>
        <input
          className={field}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <Label>Degree program</Label>
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
        <label className="block">
          <Label hint="four digits">Grad year</Label>
          <input
            className={field}
            name="gradYear"
            inputMode="numeric"
            required
            placeholder="2018"
            maxLength={4}
          />
        </label>
      </div>

      <label className="block">
        <Label>LinkedIn profile</Label>
        <input
          className={field}
          name="linkedin"
          type="url"
          placeholder="https://www.linkedin.com/in/yourname"
        />
      </label>

      <p className="text-xs leading-relaxed text-white/45">
        Your details are only used to send WILA news and event invitations,
        and are never shared outside the board.
      </p>

      <Submit />

      {/* The group is where members actually talk to each other, so point at
          it here as well as on the thank-you screen. */}
      <p className="text-sm leading-relaxed text-white/55">
        Already signed up? Join the conversation in our{" "}
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-california-gold underline decoration-california-gold/40 underline-offset-4 transition hover:text-white hover:decoration-white/60"
        >
          WILA LinkedIn group
        </a>
        .
      </p>
    </form>
  );
}
