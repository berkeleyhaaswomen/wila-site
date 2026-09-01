"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-scrubbed canvas hero.
 *
 * The section is tall; the canvas inside is sticky. Scroll position through
 * the section maps to a progress value from 0 to 1, and every frame is drawn
 * from that number alone. Nothing animates on a timer, so scrubbing backwards
 * is exact and the motion is locked to the wheel the way Apple's product
 * pages are.
 *
 * The sprite is the real gold face mark from the WILA logo, so the whole
 * sequence is built out of the brand rather than decoration laid on top.
 */

const STAGES = [
  { at: 0.06, kicker: "Berkeley Haas", line: "Women in\nLeadership" },
  { at: 0.34, kicker: "1,200 alumnae", line: "A network\nthat shows up" },
  { at: 0.62, kicker: "Twelve chapters", line: "Across the\nworld" },
  { at: 0.86, kicker: "Since 2010", line: "Welcome\nto WILA" }
];

/** Smoothstep. Softens the ends of every transition. */
function ease(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/** Progress of `p` through the window [a, b], clamped and eased. */
function phase(p: number, a: number, b: number): number {
  return ease((p - a) / (b - a));
}

type Particle = { a: number; r: number; z: number; size: number; hue: number };

export default function ScrollHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mark = new Image();
    let markReady = false;

    // Fixed field of particles. Seeded once so they don't shimmer between
    // frames, and positioned by scroll rather than by time.
    const COUNT = window.innerWidth < 768 ? 26 : 54;
    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => {
      const golden = i * 2.399963;
      return {
        a: golden,
        r: 0.18 + ((i * 37) % 100) / 145,
        z: ((i * 61) % 100) / 100,
        size: 4 + (((i * 17) % 100) / 100) * 16,
        hue: (i * 29) % 100
      };
    });

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function progress(): number {
      const rect = wrap!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    }

    /** One mark, drawn at a polar position with its own scale and fade. */
    function drawMark(
      cx: number,
      cy: number,
      angle: number,
      radius: number,
      scale: number,
      alpha: number,
      spin: number,
      glowing = false
    ) {
      if (!markReady || alpha <= 0.01 || scale <= 0.01) return;
      const w = mark.width * scale;
      const h = mark.height * scale;
      ctx!.save();
      ctx!.globalAlpha = Math.min(1, alpha);
      if (glowing) ctx!.globalCompositeOperation = "screen";
      ctx!.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx!.rotate(spin);
      ctx!.drawImage(mark, -w / 2, -h / 2, w, h);
      ctx!.restore();
    }

    function draw() {
      const p = progress();
      const cx = width / 2;
      const cy = height * 0.42;
      const unit = Math.min(width, height);

      // ---- backdrop: Berkeley blue, deepening as you descend -------------
      const warm = phase(p, 0.5, 1);
      const bg = ctx!.createRadialGradient(
        cx,
        cy - unit * 0.1,
        unit * 0.05,
        cx,
        cy,
        unit * 0.95
      );
      bg.addColorStop(0, warm > 0.4 ? "#0B4A7D" : "#0A3866");
      bg.addColorStop(0.55, "#00305E");
      bg.addColorStop(1, "#001427");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, width, height);

      // ---- gold aurora, breathing with scroll ----------------------------
      const glow = ctx!.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        unit * (0.25 + phase(p, 0, 0.6) * 0.5)
      );
      const glowStrength =
        (0.09 + phase(p, 0.15, 0.75) * 0.22) * (1 - phase(p, 0.78, 1) * 0.55);
      glow.addColorStop(0, `rgba(253, 181, 21, ${glowStrength})`);
      glow.addColorStop(1, "rgba(253, 181, 21, 0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, width, height);

      // ---- particle field, pushed outward as you scroll ------------------
      const spread = phase(p, 0.1, 0.95);
      for (const q of particles) {
        const r = unit * q.r * (0.25 + spread * 1.15);
        const a = q.a + p * (1.4 + q.z * 1.6);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.62;
        const fade = (0.1 + q.z * 0.4) * (1 - phase(p, 0.85, 1) * 0.8);
        ctx!.beginPath();
        ctx!.arc(x, y, q.size * (0.35 + q.z * 0.65) * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle =
          q.hue > 35
            ? `rgba(253, 181, 21, ${fade})`
            : `rgba(214, 232, 255, ${fade * 0.3})`;
        ctx!.fill();
      }

      // ---- the marks -----------------------------------------------------
      // Stage 1: a single mark rises and grows.
      // Stage 2: it multiplies into a ring that opens outward.
      // Stage 3: the ring turns and the marks pulse in a travelling wave.
      // Stage 4: everything collapses back to one, larger and steady.
      const base = unit / (mark.height || 1);

      const bloom = phase(p, 0.18, 0.52);
      const orbit = phase(p, 0.42, 0.82);
      const collapse = phase(p, 0.78, 1);

      const ringCount = 12;
      const ringRadius = unit * 0.33 * bloom * (1 - collapse * 0.92);

      for (let i = 0; i < ringCount; i++) {
        const t = i / ringCount;
        const angle = t * Math.PI * 2 + orbit * 1.9 - Math.PI / 2;
        // A wave of scale travels around the ring as it turns.
        const wave = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 2 + p * 9);
        const scale =
          base * 0.17 * (0.55 + wave * 0.6) * bloom * (1 - collapse * 0.75);
        const alpha = bloom * (0.45 + wave * 0.55) * (1 - collapse);
        drawMark(cx, cy, angle, ringRadius, scale, alpha, angle + Math.PI / 2, true);
      }

      // The hero mark, present the whole way through.
      const rise = phase(p, 0, 0.22);
      const heroScale =
        base * (0.45 + rise * 0.08 + collapse * 0.35) * (1 - phase(p, 0.97, 1) * 0.15);
      const heroAlpha = 0.72 + rise * 0.28;
      drawMark(
        cx,
        cy + unit * (0.1 - rise * 0.1),
        0,
        0,
        heroScale,
        heroAlpha,
        Math.sin(p * Math.PI * 2) * 0.06
      );

      // ---- vignette ------------------------------------------------------
      const vig = ctx!.createRadialGradient(cx, cy, unit * 0.3, cx, cy, unit * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0, 8, 20, 0.42)");
      ctx!.fillStyle = vig;
      ctx!.fillRect(0, 0, width, height);

      // Which caption is showing.
      let next = 0;
      for (let i = 0; i < STAGES.length; i++) if (p >= STAGES[i].at) next = i;
      setStage((prev) => (prev === next ? prev : next));
    }

    let frame = 0;
    let queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(() => {
        queued = false;
        draw();
      });
    }

    resize();
    mark.onload = () => {
      markReady = true;
      draw();
    };
    mark.src = "/wila-mark.png";
    // A cached image can already be complete by the time the handler is
    // attached, in which case onload never fires.
    if (mark.complete && mark.naturalHeight > 0) markReady = true;
    draw();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      resize();
      draw();
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative h-[420vh] bg-berkeley-blue"
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Captions sit low and left, the way a poster is set, so the
            animation keeps the optical centre of the frame. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="container-wide pb-14 md:pb-20">
            <div className="relative h-[7.5rem] max-w-[min(92vw,44rem)] md:h-[12.5rem]">
              {STAGES.map((s, i) => (
                <div
                  key={s.kicker}
                  className={`absolute bottom-0 left-0 transition-all duration-[900ms] ease-out ${
                    i === stage
                      ? "translate-y-0 opacity-100 blur-0"
                      : "translate-y-5 opacity-0 blur-[3px]"
                  }`}
                >
                  <div className="mb-3 inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-california-gold md:text-[11px]">
                    <span className="h-px w-7 bg-california-gold/70" />
                    {s.kicker}
                  </div>
                  <h1 className="display whitespace-pre-line text-[clamp(2rem,5.6vw,5rem)] text-white [text-shadow:0_10px_50px_rgba(0,8,24,0.7)]">
                    {s.line}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll affordance, retiring once you have started. */}
        <div
          className={`pointer-events-none absolute bottom-10 right-6 flex flex-col items-center gap-2 transition-opacity duration-500 md:right-10 ${
            stage === 0 ? "opacity-70" : "opacity-0"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
            Scroll
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-california-gold to-transparent" />
        </div>
      </div>

      {reduced && (
        <span className="sr-only">
          Animated introduction. Motion is reduced based on your system setting.
        </span>
      )}
    </section>
  );
}
