import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollHero from "@/components/ScrollHero";
import About from "@/components/About";
import Pillars from "@/components/Pillars";
import Events from "@/components/Events";
import Spotlight from "@/components/Spotlight";
import Leadership from "@/components/Leadership";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LogoWatermark />
      <Nav />
      <ScrollHero />
      <About />
      <Pillars />
      <Events />
      <Spotlight />
      <Leadership />
      <CTA />
      <Footer />
    </main>
  );
}
