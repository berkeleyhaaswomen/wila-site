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
    <div className="min-h-screen bg-[#F7F7F4]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3.5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img src="/wila-mark.png" alt="" aria-hidden="true" className="h-6 w-auto" />
            <span className="font-display text-[13px] uppercase tracking-[0.14em] text-ink">
              WILA Admin
            </span>
          </Link>

          {/* Underline rather than filled pills. The bar is a tool, not a
              landing page, so the active state should be quiet. */}
          <nav className="flex flex-wrap items-center gap-6">
            {links.map((l) => {
              const active = l.exact ? current === l.href : current.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-[13px] font-medium transition ${
                    active
                      ? "text-ink after:absolute after:inset-x-0 after:-bottom-[15px] after:h-[2px] after:bg-berkeley-blue"
                      : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4 text-[13px]">
            <span className="hidden items-center gap-2 text-ink/55 sm:flex">
              {user.name || user.email}
              <span className="rounded border border-ink/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                {user.role === "superadmin" ? "Super admin" : "Admin"}
              </span>
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md px-2.5 py-1.5 font-medium text-ink/55 transition hover:bg-black/5 hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-6">
          <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] uppercase leading-[0.95] tracking-[-0.015em] text-ink">
            {title}
          </h1>
          {action}
        </div>
        {children}
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-12 text-xs text-ink/40">
        <Link href="/" className="transition hover:text-ink/70">
          Back to the public site
        </Link>
      </footer>
    </div>
  );
}
