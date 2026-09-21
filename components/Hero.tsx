"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * Home page masthead.
 *
 * Deliberately short: roughly half a screen, so the first thing a visitor
 * sees is WILA plus the start of the page rather than a full-height animation
 * they have to scroll through. It replaces the scroll-scrubbed hero, which
 * pinned the page for four screens.
 *
 * The backdrop is a field of gold and pale dots drifting slowly on a timer.
 * The loop pauses whenever the masthead is off screen or the tab is hidden,
 * and draws a single still frame for anyone who prefers reduced motion.
 */

type Dot = {
  x: number; // 0..1 across
  y: number; // 0..1 down
  r: number; // radius in px at 1x
  speed: number;
  phase: number;
  gold: boolean;
  alpha: number;
};

export default function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Seeded rather than random so the layout is the same on every visit.
    const count = window.innerWidth < 768 ? 34 : 70;
    const dots: Dot[] = Array.from({ length: count }, (_, i) => {
      const a = (i * 0.618034) % 1;
      const b = (i * 0.754877) % 1;
      const z = ((i * 37) % 100) / 100;
      return {
        x: a,
        y: b,
        r: 1.5 + z * 5.5,
        speed: 0.004 + z * 0.012,
        phase: i * 1.7,
        gold: (i * 29) % 100 > 40,
        alpha: 0.12 + z * 0.45
      };
    });

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        // Slow upward drift with a gentle sideways sway, wrapping at the top.
        const y = (((d.y - t * d.speed) % 1) + 1) % 1;
        const x = d.x + Math.sin(t * 0.35 + d.phase) * 0.012;
        const flicker = 0.75 + 0.25 * Math.sin(t * 0.8 + d.phase);
        ctx.beginPath();
        ctx.arc(x * width, y * height, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.gold
          ? `rgba(253, 181, 21, ${d.alpha * flicker})`
          : `rgba(214, 232, 255, ${d.alpha * 0.45 * flicker})`;
        ctx.fill();
      }
    };

    resize();

    if (reduced) {
      draw(0);
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? play() : pause();
    });
    io.observe(wrap);

    const onVisibility = () => (document.hidden ? pause() : play());
    const onResize = () => resize();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    play();

    return () => {
      pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative flex min-h-[30rem] items-end overflow-hidden bg-berkeley-blue bg-gradient-to-br from-[#001C38] via-berkeley-blue to-[#0B4A7D] md:h-[58vh] md:min-h-[34rem]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-california-gold/10 blur-3xl"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="container-wide relative w-full pb-12 pt-28 md:pb-16">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-california-gold md:text-[11px]">
            <span className="h-px w-7 bg-california-gold/70" />
            Berkeley Haas · Founded 2021
          </div>
          <h1 className="display text-[clamp(2.4rem,6.4vw,5.25rem)] text-white [text-shadow:0_10px_50px_rgba(0,8,24,0.55)]">
            Women in
            <br />
            Leadership
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-lg">
            A worldwide network of Berkeley Haas alumnae, committed to a
            community that celebrates and amplifies the power of bringing women
            together.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/join"
              className="group inline-flex items-center gap-2.5 rounded-full bg-california-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Join Our Community
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-berkeley-blue"
            >
              See events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
