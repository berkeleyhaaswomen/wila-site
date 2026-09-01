"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/#events", label: "Events" },
  { href: "/photos", label: "Photos" },
  { href: "/board", label: "Board" },
  { href: "/#contact", label: "Contact" }
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-ink/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex h-16 items-center justify-end gap-6 md:h-20">
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`relative py-1 text-[13px] font-semibold uppercase tracking-[0.14em] transition ${
                isActive(l.href)
                  ? "text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-california-gold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="/join"
            className="inline-flex items-center justify-center rounded-full border border-california-gold/70 bg-california-gold/15 px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-california-gold transition hover:bg-california-gold hover:text-ink focus:outline-none focus:ring-2 focus:ring-california-gold focus:ring-offset-2 focus:ring-offset-berkeley-blue"
          >
            Join us
          </a>
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-md border border-white/30 md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d={open ? "M3 3l12 12M15 3L3 15" : "M2 4h14M2 9h14M2 14h14"}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/95 backdrop-blur-xl md:hidden">
          <div className="container-wide flex flex-col py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-white/5 py-3.5 font-display text-sm uppercase tracking-[0.1em] text-white/85 transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/join"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-california-gold/70 bg-california-gold/15 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-california-gold"
            >
              Join us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
