import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Spotlight from "@/components/Spotlight";
import Pillars from "@/components/Pillars";
import Events from "@/components/Events";
import Mentorship from "@/components/Mentorship";
import BoardStrip from "@/components/BoardStrip";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

/**
 * Regenerate periodically as well as on demand. Saving in /admin already calls
 * revalidatePath, but that only covers edits made through the admin. This is
 * the safety net for anything that changes the data another way.
 */
export const revalidate = 300;

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <Hero />
      <About />
      <Spotlight />
      <Pillars />
      <Events />
      <Mentorship />
      <BoardStrip />
      <CTA />
      <Footer />
    </main>
  );
}
