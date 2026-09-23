import type { Metadata } from "next";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import NominateForm from "./NominateForm";

export const metadata: Metadata = {
  title: "Nominate an alumna · WILA",
  description:
    "Nominate a Berkeley Haas alumna for the quarterly WILA spotlight.",
  robots: { index: false, follow: true }
};

export default function NominatePage() {
  return (
    <main className="min-h-screen bg-ink">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />

      <section className="relative min-h-screen overflow-hidden">
        <Parallax
          src="/photos/wila-28.jpg"
          speed={0.12}
          className="absolute inset-0 h-full w-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-berkeley-blue/85 to-ink" />

        <div className="container-tight relative grid gap-14 py-32 md:grid-cols-12 md:gap-16 md:py-40">
          <Reveal className="block md:col-span-5">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-california-gold">
              <span className="h-px w-8 bg-california-gold/70" />
              Alumnae spotlight
            </span>
            <h1 className="display mt-6 text-[clamp(2rem,5.5vw,4.25rem)] text-white">
              Nominate
              <br />
              an alumna
            </h1>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70 md:text-lg">
              Every quarter we feature a Berkeley Haas alumna whose work
              reflects the WILA pillars in motion. Anyone from Haas can be
              nominated, by anyone. You do not have to know her well, and you
              can nominate yourself.
            </p>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
              The board reads every nomination and gets in touch from there.
            </p>
          </Reveal>

          <Reveal delay={140} className="block md:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm md:p-10">
              <NominateForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
