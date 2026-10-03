import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";

export default function Feedback() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0e1a]">
      <Navbar />
      <main className="pt-16">
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
