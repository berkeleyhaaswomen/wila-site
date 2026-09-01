import { redirect } from "next/navigation";
import Link from "next/link";

import { getSessionUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams
}: {
  searchParams: { next?: string };
}) {
  // Already signed in? Skip the form.
  const user = await getSessionUser();
  if (user) redirect(searchParams.next || "/admin");

  return (
    <div className="grid min-h-screen place-items-center bg-[#F7F7F4] px-6 py-16">
      <div className="w-full max-w-[22rem]">
        <div className="mb-9 flex items-center gap-3">
          <img src="/wila-mark.png" alt="" aria-hidden="true" className="h-9 w-auto" />
          <div>
            <h1 className="font-display text-lg uppercase leading-none tracking-[-0.01em] text-ink">
              WILA Admin
            </h1>
            <p className="mt-1.5 text-[13px] text-ink/55">
              Events and spotlights
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6">
          <LoginForm next={searchParams.next ?? "/admin"} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink/45">
          Need access? Ask a super admin to add you.
          <br />
          <Link href="/" className="mt-1.5 inline-block transition hover:text-ink/70">
            Back to the public site
          </Link>
        </p>
      </div>
    </div>
  );
}
