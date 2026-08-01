/**
 * Industries Section — Sectors served by Stark Tech
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  GraduationCap,
  Hospital,
  Landmark,
  Rocket,
  Building,
  Factory,
} from "lucide-react";

const industries = [
  {
    icon: GraduationCap,
    name: "Education & K-12",
    desc: "Optimizing learning environments with smart building controls, energy efficiency, and safety systems.",
  },
  {
    icon: Hospital,
    name: "Healthcare",
    desc: "Critical environment management ensuring patient safety, air quality, and operational continuity.",
  },
  {
    icon: Landmark,
    name: "Government & Military",
    desc: "Secure, compliant facility solutions for federal, state, and municipal operations.",
  },
  {
    icon: Rocket,
    name: "Space & Aerospace",
    desc: "Mission-critical building systems for Space Coast facilities and aerospace installations.",
  },
  {
    icon: Building,
    name: "Commercial & Sports",
    desc: "Professional stadiums, arenas, and commercial properties with integrated automation.",
  },
  {
    icon: Factory,
    name: "Industrial & Data Centers",
    desc: "High-performance cooling, power management, and energy optimization for mission-critical infrastructure.",
  },
];

export default function Industries() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="industries"
      className="py-24 lg:py-32 bg-[oklch(0.18_0.02_260)] relative overflow-hidden"
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10" ref={ref}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[oklch(0.65_0.12_60)] text-sm font-mono-data font-medium uppercase tracking-widest">
            Industries Served
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mt-3">
            Solutions Across{" "}
            <span className="text-[oklch(0.65_0.12_60)]">Every Sector</span>
          </h2>
          <p className="text-white/50 mt-4 text-lg">
            From K-12 schools to Space Coast facilities, we serve organizations
            that demand the highest standards of performance and reliability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group p-6 border border-white/10 rounded-sm hover:border-[oklch(0.65_0.12_60)]/40 hover:bg-white/5 transition-all duration-300"
            >
              <ind.icon className="w-10 h-10 text-[oklch(0.65_0.12_60)] mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {ind.name}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
