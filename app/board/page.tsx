import type { Metadata } from "next";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import Leadership from "@/components/Leadership";
import CTA from "@/components/CTA";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Board · WILA",
  description: "The volunteer alumnae behind Berkeley Haas WILA."
};

export default function BoardPage() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <PageHeader
        eyebrow="The board"
        title={"Meet the women\nbehind WILA"}
        lede="Co-presidents, advisors, and board members, all volunteers."
        photo="/photos/wila-23.jpg"
      />
      <Leadership showIntro={false} />
      <CTA />
      <Footer />
    </main>
  );
}
