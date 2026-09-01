import type { Metadata } from "next";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import JoinForm from "./JoinForm";

export const metadata: Metadata = {
  title: "Become a member · WILA",
  description:
    "Join the Berkeley Haas Women in Leadership Alumnae network for event invitations, mentorship, and community news."
};

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-ink">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />

      <section className="relative min-h-screen overflow-hidden">
        <Parallax
          src="/photos/wila-07.jpg"
          speed={0.12}
          className="absolute inset-0 h-full w-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-berkeley-blue/85 to-ink" />

        <div className="container-tight relative grid gap-14 py-32 md:grid-cols-12 md:gap-16 md:py-40">
          <Reveal className="block md:col-span-5">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-california-gold">
              <span className="h-px w-8 bg-california-gold/70" />
              Become a member
            </span>
            <h1 className="display mt-6 text-[clamp(2rem,5.5vw,4.25rem)] text-white">
              Join the
              <br />
              network
            </h1>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70 md:text-lg">
              Membership is free and open to every Berkeley Haas alumna. You
              will get event invitations, mentor program openings, and the
              quarterly spotlight.
            </p>
          </Reveal>

          <Reveal delay={140} className="block md:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm md:p-10">
              <JoinForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
