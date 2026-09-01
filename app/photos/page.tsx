import type { Metadata } from "next";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import PageHeader from "@/components/PageHeader";
import { GALLERY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photos · WILA",
  description: "Moments from WILA events, summits, and chapter gatherings."
};

export default function PhotosPage() {
  return (
    <main className="min-h-screen bg-cream">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <PageHeader
        eyebrow="Photos"
        title={"See what\nwe have been up to"}
        lede="Summits, panels, chapter dinners, and the conversations in between."
        photo="/photos/wila-29.jpg"
      />
      <section className="container-wide pb-24 pt-14 md:pb-32 md:pt-20">
        <Gallery photos={GALLERY} />
      </section>
      <Footer />
    </main>
  );
}
