"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The WILA lockup, pinned to the top left for the whole scroll so it floats
 * over the canvas animation.
 *
 * It shares the nav's container and bar height rather than carrying its own
 * offsets, so it lines up with the links on the right by construction. The
 * previous version positioned itself with left/top values that had to be kept
 * in step with the nav by hand, and at 96px tall it overflowed the 80px bar
 * and sat visibly low.
 *
 * The wrapper ignores pointer events so it never steals clicks from the nav
 * across the full width; only the logo itself is clickable.
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="container-wide flex h-16 items-center md:h-20">
        <Link
          href="/"
          aria-label="WILA, Berkeley Haas Women in Leadership Alumnae"
          className="pointer-events-auto inline-block"
        >
          <img
            src="/wila-logo.png"
            alt=""
            aria-hidden="true"
            width={2048}
            height={1688}
            className={`w-auto drop-shadow-[0_8px_30px_rgba(0,10,30,0.45)] transition-all duration-500 ${
              shrunk ? "h-9 opacity-90 md:h-11" : "h-11 opacity-100 md:h-16"
            }`}
          />
        </Link>
      </div>
    </div>
  );
}
