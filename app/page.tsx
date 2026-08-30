import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
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
      <Nav />
      <Hero />
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
