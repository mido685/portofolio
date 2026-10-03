/**
 * STARK AI Portfolio — Home Page
 * Design: Dark Neon Tech Portfolio (Reference Match)
 */
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Technologies from "@/components/Technologies";
import Architecture from "@/components/Architecture";
import Achievements from "@/components/Achievements";
import CurrentlyBuilding from "@/components/CurrentlyBuilding";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0e1a]">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Technologies />
      <Architecture />
      <Achievements />
      <CurrentlyBuilding />
      <Blog />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
