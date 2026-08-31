import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/spotlights", label: "Spotlights" },
  { href: "/admin/users", label: "Users", superadminOnly: true },
  { href: "/admin/account", label: "Account" }
];

export default function AdminShell({
  user,
  current,
  title,
  action,
  children
}: {
  user: SessionUser;
  /** href of the nav item to highlight */
  current: string;
  title: string;
  /** optional top-right control, e.g. a "New event" button */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const links = NAV.filter((n) => !n.superadminOnly || user.role === "superadmin");

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/10 bg-berkeley-blue text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img src="/wila-mark.png" alt="" aria-hidden="true" className="h-7 w-auto" />
            <span className="font-serif text-sm font-semibold">WILA Admin</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {links.map((l) => {
              const active = l.exact ? current === l.href : current.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-white/70 sm:inline">
              {user.name || user.email}
              <span className="ml-2 rounded-full bg-california-gold/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-california-gold">
                {user.role === "superadmin" ? "Super admin" : "Admin"}
              </span>
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-berkeley-blue"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-3xl tracking-tight text-ink">{title}</h1>
          {action}
        </div>
        {children}
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-ink/45">
        <Link href="/" className="hover:text-ink/70">
          ← Back to the public site
        </Link>
      </footer>
    </div>
  );
}
