import type { Metadata } from "next";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import About from "@/components/About";
import PinnedPillars from "@/components/PinnedPillars";
import CTA from "@/components/CTA";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About · WILA",
  description:
    "Berkeley Haas Women in Leadership Alumnae: who we are, and the four pillars we are built on."
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <PageHeader
        eyebrow="About us"
        title={"What makes\nWILA special"}
        lede="A worldwide network of Berkeley Haas alumnae, turning leadership principles into practice."
        photo="/photos/wila-07.jpg"
      />
      <About />
      <PinnedPillars />
      <CTA />
      <Footer />
    </main>
  );
}
