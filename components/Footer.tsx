export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink py-14 text-white/80">
      <div className="container-tight grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <img
            src="/wila-logo.png"
            alt="Berkeley Haas WILA, Women in Leadership Alumnae"
            width={2048}
            height={1688}
            className="h-20 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Women in Leadership Alumnae is the official women's alumnae network
            of the Haas School of Business, University of California, Berkeley.
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-california-gold">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-white" href="#about">About</a></li>
            <li><a className="hover:text-white" href="#pillars">Pillars</a></li>
            <li><a className="hover:text-white" href="#events">Events</a></li>
            <li><a className="hover:text-white" href="#spotlight">Spotlight</a></li>
            <li><a className="hover:text-white" href="#leadership">Leadership</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-california-gold">
            Contact
          </div>
          <p className="mt-4 text-sm text-white/70">
            <a className="hover:text-white" href="mailto:wila@haas.berkeley.edu">
              wila@haas.berkeley.edu
            </a>
            <br />
            Haas School of Business
            <br />
            2220 Piedmont Ave, Berkeley, CA 94720
          </p>
          <div className="mt-4 flex gap-3">
            <a aria-label="LinkedIn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white hover:text-berkeley-blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/>
              </svg>
            </a>
            <a aria-label="Instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white hover:text-berkeley-blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container-tight mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center">
        <div>© {year} Women in Leadership Alumnae. All rights reserved.</div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <span>An independent volunteer-led group affiliated with UC Berkeley Haas Alumni Network.</span>
          <a
            href="/admin"
            className="shrink-0 font-semibold text-white/70 underline decoration-white/30 underline-offset-4 transition hover:text-california-gold hover:decoration-california-gold"
          >
            Administrator? Sign in here.
          </a>
        </div>
      </div>
    </footer>
  );
}
