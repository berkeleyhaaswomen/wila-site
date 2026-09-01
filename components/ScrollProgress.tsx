"use client";

import { useEffect, useState } from "react";

/** Hairline reading-progress rail pinned to the top of the viewport. */
export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let queued = false;
    let frame = 0;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-california-gold"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  );
}
