"use client";

import { useEffect, useState } from "react";

/**
 * The full WILA lockup, pinned to the top left for the whole scroll so it
 * floats over the canvas animation.
 *
 * It shrinks once you leave the hero, so it stays present without competing
 * with the page content underneath.
 */
export default function LogoWatermark() {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-label="WILA, Berkeley Haas Women in Leadership Alumnae"
      className="fixed left-5 top-4 z-[60] block transition-all duration-500 md:left-8 md:top-6"
    >
      <img
        src="/wila-logo.png"
        alt=""
        aria-hidden="true"
        width={2048}
        height={1688}
        className={`w-auto drop-shadow-[0_8px_30px_rgba(0,10,30,0.45)] transition-all duration-500 ${
          shrunk ? "h-9 opacity-90 md:h-14" : "h-12 opacity-100 md:h-24"
        }`}
      />
    </a>
  );
}
