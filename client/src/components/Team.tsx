/**
 * Team Section — Leadership profiles with industrial executive-data treatment
 * Industrial Authority: structural framing, steel-blue panels, data-driven presentation
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, ChevronRight } from "lucide-react";

const team = [
  {
    name: "Tim Geiger",
    role: "CEO & Owner / Founder",
    focus: "Strategic Vision & Growth",
  },
  {
    name: "Randy Urschel",
    role: "Chairman of the Board & Owner / Founder",
    focus: "Corporate Governance",
  },
  {
    name: "Dennis Donovan",
    role: "Chairman Emeritus & Owner / Founder",
    focus: "Strategic Advisory",
  },
  {
    name: "Ted O'Shea",
    role: "President",
    focus: "Operational Leadership",
  },
  {
    name: "Robert Beckman",
    role: "EVP, Chief Financial Officer",
    focus: "Financial Strategy",
  },
  {
    name: "Craig Aszkler",
    role: "EVP, Renewables",
    focus: "Clean Energy Division",
  },
];

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="team" className="py-24 lg:py-32">
      <div className="container" ref={ref}>
        {/* Header — left-aligned, structural */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-[oklch(0.65_0.12_60)]" />
            <span className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data font-medium tracking-[0.25em] uppercase">
              Executive Leadership
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[oklch(0.18_0.02_260)] leading-tight max-w-2xl">
            Powered by{" "}
            <span className="text-[oklch(0.35_0.08_260)]">
              Exceptional People
            </span>
          </h2>
          <p className="text-[oklch(0.35_0.02_260)]/50 mt-5 text-base max-w-xl">
            Our vision works because of the people behind it. A team of 600+
            professionals dedicated to innovation and excellence.
          </p>
        </div>

        {/* Executive Grid — Industrial data panel style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group relative bg-[oklch(0.18_0.02_260)] rounded-sm overflow-hidden border border-white/5 hover:border-[oklch(0.65_0.12_60)]/30 transition-all duration-300"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[oklch(0.35_0.08_260)] to-[oklch(0.65_0.12_60)] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6">
                {/* Structural header bar */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-8 bg-[oklch(0.65_0.12_60)] rounded-sm" />
                  <div>
                    <h3 className="font-display font-semibold text-white text-lg">
                      {member.name}
                    </h3>
                    <p className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Focus area — data style */}
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <ChevronRight size={12} className="text-[oklch(0.65_0.12_60)]" />
                  <span className="font-mono-data">{member.focus}</span>
                </div>

                {/* Decorative grid */}
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.03]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                    backgroundSize: "12px 12px",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
