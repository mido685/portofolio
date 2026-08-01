/**
 * Awards Section — Recognition and certifications
 * Industrial Authority: dark steel panels, copper accents, structural framing
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Trophy, Star, BadgeCheck } from "lucide-react";

const awards = [
  {
    icon: Trophy,
    title: "Schneider Electric Global Partner of the Year",
    year: "2022",
    desc: "Named for outstanding commitment to sustainability projects across building automation, power management, and security.",
  },
  {
    icon: Award,
    title: "Schneider Electric Global Impact Maker",
    year: "2024",
    desc: "Recognized for supporting energy efficiency, decarbonization, and sustainability goals of customers worldwide.",
  },
  {
    icon: BadgeCheck,
    title: "Master EcoXpert Partner",
    year: "Current",
    desc: "Certified Master EcoXpert in Building Automation, Power Management, and Building Security.",
  },
  {
    icon: Star,
    title: "ATT Supplier Sustainability Award",
    year: "2023",
    desc: "Recognized for excellence in sustainable building solutions and environmental responsibility.",
  },
  {
    icon: Award,
    title: "Eagle Award for Excellence in Construction",
    year: "2023",
    desc: "Integration team recognized for outstanding construction excellence and project delivery.",
  },
  {
    icon: Trophy,
    title: "National Grid Gridee Award — Top ProNet Partner",
    year: "2024",
    desc: "Top partner for Clean Heat installations, demonstrating leadership in high-efficiency systems.",
  },
];

export default function Awards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="awards" className="py-24 lg:py-32 bg-[oklch(0.96_0.005_80)]">
      <div className="container" ref={ref}>
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-[oklch(0.65_0.12_60)]" />
            <span className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data font-medium tracking-[0.25em] uppercase">
              Recognition
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[oklch(0.18_0.02_260)] leading-tight max-w-2xl">
            Award-Winning{" "}
            <span className="text-[oklch(0.35_0.08_260)]">
              Service & Solutions
            </span>
          </h2>
          <p className="text-[oklch(0.35_0.02_260)]/50 mt-5 text-base max-w-xl">
            Our commitment to excellence has earned recognition from industry
            leaders and partners worldwide.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[oklch(0.88_0.01_80)]">
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="bg-white p-6 hover:bg-[oklch(0.98_0.003_80)] transition-all duration-300 group relative"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[oklch(0.65_0.12_60)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[oklch(0.18_0.02_260)] rounded-sm flex items-center justify-center">
                  <award.icon className="w-5 h-5 text-[oklch(0.65_0.12_60)]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[oklch(0.18_0.02_260)] text-sm leading-snug mb-1">
                    {award.title}
                  </h3>
                  <span className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data font-medium">
                    {award.year}
                  </span>
                  <p className="text-xs text-[oklch(0.35_0.02_260)]/50 mt-2 leading-relaxed">
                    {award.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
