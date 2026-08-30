"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#pillars", label: "Pillars" },
  { href: "#events", label: "Events" },
  { href: "#spotlight", label: "Spotlight" },
  { href: "#leadership", label: "Leadership" },
  { href: "#contact", label: "Contact" }
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled
          ? "border-b border-white/10 bg-berkeley-blue/90 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-center gap-3">
          <img
            src="/wila-mark.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-auto md:h-11"
          />
          <span className="leading-tight">
            <span className="block font-serif text-base font-semibold text-white">
              WILA
            </span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-white/70">
              Berkeley Haas
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-berkeley-blue focus:outline-none focus:ring-2 focus:ring-california-gold focus:ring-offset-2 focus:ring-offset-berkeley-blue"
          >
            Join us
          </a>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-md border border-white/30 md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M2 4h14M2 9h14M2 14h14"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-berkeley-blue/95 backdrop-blur md:hidden">
          <div className="container-wide flex flex-col gap-1 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
