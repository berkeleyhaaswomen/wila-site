import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Mentorship from "@/components/Mentorship";
import ScrollHero from "@/components/ScrollHero";
import About from "@/components/About";
import PinnedPillars from "@/components/PinnedPillars";
import Events from "@/components/Events";
import Spotlight from "@/components/Spotlight";
import BoardStrip from "@/components/BoardStrip";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <ScrollHero />
      <About />
      <PinnedPillars />
      <Events />
      <Mentorship />
      <Spotlight />
      <BoardStrip />
      <CTA />
      <Footer />
    </main>
  );
}
