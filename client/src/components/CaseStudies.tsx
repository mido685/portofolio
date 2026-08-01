/**
 * Case Studies Section — Featured project results
 * Industrial Authority: dark panels, data-driven results, structural framing
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const cases = [
  {
    image: "/manus-storage/stark-data-center_c62c3b36.jpg",
    tag: "DATA CENTER",
    title: "Stark Technology's CRAC Unit Upgrade & BMS Integration",
    client: "Global Technology Company",
    metrics: [
      { value: "65%", label: "Energy Reduction" },
      { value: "$500K", label: "Rebates Secured" },
      { value: "70%", label: "Optimal Capacity" },
    ],
  },
  {
    image: "/manus-storage/stark-hospital-project_0872cf5a.jpg",
    tag: "HIGHER EDUCATION",
    title: "Sustainable Campus Facility Renovation",
    client: "Saint Peter's University",
    metrics: [
      { value: "100%", label: "Grant Funded" },
      { value: "3+", label: "Systems Integrated" },
      { value: "A+", label: "Performance Rating" },
    ],
  },
  {
    image: "/manus-storage/stark-solar-renewable_5829ab36.jpg",
    tag: "CLEAN ENERGY",
    title: "Renewable Energy Campus Initiative",
    client: "University of Rochester",
    metrics: [
      { value: "2.4MW", label: "Solar Capacity" },
      { value: "40%", label: "Cost Reduction" },
      { value: "Net 0", label: "Carbon Goal" },
    ],
  },
];

export default function CaseStudies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="case-studies" className="py-24 lg:py-32 bg-[oklch(0.18_0.02_260)] relative overflow-hidden">
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10" ref={ref}>
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-[oklch(0.65_0.12_60)]" />
            <span className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data font-medium tracking-[0.25em] uppercase">
              Featured Projects
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
            Delivering{" "}
            <span className="text-[oklch(0.65_0.12_60)]">
              Measurable Results
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {cases.map((cs, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group bg-[oklch(0.12_0.02_260)] rounded-sm border border-white/5 overflow-hidden hover:border-[oklch(0.65_0.12_60)]/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.02_260)] via-transparent to-transparent" />
                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[oklch(0.65_0.12_60)]/90 text-white text-[10px] font-mono-data font-medium tracking-[0.15em] uppercase rounded-sm">
                    {cs.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display font-semibold text-white text-base leading-snug mb-2">
                  {cs.title}
                </h3>
                <p className="text-white/30 text-xs font-mono-data mb-5">
                  {cs.client}
                </p>

                {/* Metrics — data readout style */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                  {cs.metrics.map((m, j) => (
                    <div key={j} className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp size={10} className="text-[oklch(0.65_0.12_60)]" />
                        <span className="font-mono-data font-bold text-white text-sm">
                          {m.value}
                        </span>
                      </div>
                      <span className="text-[9px] text-white/30 uppercase tracking-wider mt-1 block">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
