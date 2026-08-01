/**
 * Stats Section — Key company metrics with industrial data readout style
 * Industrial Authority: monospaced data, structural panels, copper accents
 */
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Building2, DollarSign, Layers, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Building2, value: "120+", label: "Major Projects / Year" },
  { icon: DollarSign, value: "8.0", label: "Billion in Projects" },
  { icon: Layers, value: "650", label: "Million sq ft Managed" },
  { icon: ShieldCheck, value: "55.0", label: "Billion in Assets" },
];

function AnimatedValue({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numericPart = parseFloat(value);
    const isFloat = value.includes(".");
    const suffix = value.replace(/[\d.]/g, "");
    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericPart * eased;

      if (isFloat) {
        setDisplay(current.toFixed(1) + suffix);
      } else {
        setDisplay(Math.floor(current) + suffix);
      }

      if (step >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span>{display}</span>;
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 lg:py-20 bg-white relative">
      <div className="container" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="text-center lg:text-left p-6 border border-[oklch(0.88_0.01_80)] rounded-sm hover:border-[oklch(0.35_0.08_260)]/20 transition-all duration-300 group relative"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[oklch(0.35_0.08_260)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              
              <stat.icon className="w-5 h-5 text-[oklch(0.35_0.08_260)] mb-3 mx-auto lg:mx-0" />
              <div className="font-mono-data font-bold text-[oklch(0.18_0.02_260)] text-3xl lg:text-4xl mb-1">
                <AnimatedValue value={stat.value} inView={inView} />
              </div>
              <span className="text-[10px] text-[oklch(0.35_0.02_260)]/40 uppercase tracking-[0.15em]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
