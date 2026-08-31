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
    <div className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/wila-mark.png" alt="" aria-hidden="true" className="h-14 w-auto" />
          <h1 className="mt-4 font-serif text-2xl tracking-tight text-ink">
            WILA Admin
          </h1>
          <p className="mt-1.5 text-sm text-ink/60">
            Sign in to manage events and spotlights.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <LoginForm next={searchParams.next ?? "/admin"} />
        </div>

        <p className="mt-6 text-center text-xs text-ink/45">
          Need access? Ask a super admin to add you.
          <br />
          <Link href="/" className="mt-2 inline-block hover:text-ink/70">
            ← Back to the public site
          </Link>
        </p>
      </div>
    </div>
  );
}
