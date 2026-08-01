/**
 * Services Section — All 12 service offerings
 * Industrial Authority: engineered card frames, steel-blue rules, structural geometry
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Sun,
  Building2,
  Wrench,
  Settings,
  Monitor,
  Flame,
  Cog,
  Shield,
  Battery,
  Radio,
  Layers,
} from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Energy Efficiency",
    desc: "Engineering solutions & advanced technology designed to enhance energy efficiency and optimize building performance.",
  },
  {
    icon: Sun,
    title: "Clean Energy & Solar",
    desc: "Solar development, microgrid engineering, and renewable energy systems for decarbonization and sustainability.",
  },
  {
    icon: Building2,
    title: "Building Technology",
    desc: "Systems integration services that seamlessly coordinate all building systems into one cohesive, unified platform.",
  },
  {
    icon: Wrench,
    title: "Service & Maintenance",
    desc: "Cloud-based fault detection, diagnostics, and predictive analytics with emergency service agreements.",
  },
  {
    icon: Layers,
    title: "Turnkey Project Mgmt",
    desc: "End-to-end project delivery from design through commissioning, managed by our experienced engineering teams.",
  },
  {
    icon: Monitor,
    title: "Command Center Support",
    desc: "Building analytics and monitoring platforms providing real-time insights for optimal facility operations.",
  },
  {
    icon: Flame,
    title: "Renewable Natural Gas",
    desc: "Large-scale skidded equipment converting waste to renewable natural gas, reducing greenhouse emissions.",
  },
  {
    icon: Cog,
    title: "Compression & Equipment",
    desc: "Blowers, pumps, and custom-engineered solutions for demanding industrial processes and applications.",
  },
  {
    icon: Radio,
    title: "Professional A/V",
    desc: "Integrated audio-visual systems for modern facilities, delivering superior communication capabilities.",
  },
  {
    icon: Shield,
    title: "Protective Systems",
    desc: "Security, life safety, and access control integration ensuring facility safety and regulatory compliance.",
  },
  {
    icon: Battery,
    title: "Critical Power",
    desc: "Uninterruptible power systems and emergency power solutions ensuring operational continuity.",
  },
  {
    icon: Settings,
    title: "Facility Equipment",
    desc: "HVAC equipment, controls, and automation solutions with expert installation and ongoing support.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      className="py-24 lg:py-32 bg-[oklch(0.96_0.005_80)] relative"
    >
      {/* Diagonal top divider with negative margin */}
      <div className="relative -mt-16 pt-16">
        <div
          className="absolute top-0 left-0 right-0 h-20 -mt-[5rem]"
          style={{
            clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)",
            background: "oklch(0.18 0.02 260)",
          }}
        />
      </div>

      <div className="container relative z-10" ref={ref}>
        {/* Header — left-aligned for authority */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-[oklch(0.65_0.12_60)]" />
            <span className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data font-medium tracking-[0.25em] uppercase">
              Capabilities
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[oklch(0.18_0.02_260)] leading-tight max-w-2xl">
            Comprehensive Solutions for{" "}
            <span className="text-[oklch(0.35_0.08_260)]">Smarter Buildings</span>
          </h2>
          <p className="text-[oklch(0.35_0.02_260)]/50 mt-5 text-base max-w-xl">
            From energy optimization to full building automation, we deliver
            integrated solutions that drive total facility performance.
          </p>
        </div>

        {/* Services Grid — engineered card style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[oklch(0.88_0.01_80)]">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="group bg-white p-6 hover:bg-[oklch(0.98_0.003_80)] transition-all duration-300 relative"
            >
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[oklch(0.35_0.08_260)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              
              <div className="w-10 h-10 bg-[oklch(0.35_0.08_260)]/8 rounded-sm flex items-center justify-center mb-4 group-hover:bg-[oklch(0.35_0.08_260)]/15 transition-colors">
                <service.icon className="w-5 h-5 text-[oklch(0.35_0.08_260)]" />
              </div>
              <h3 className="font-display font-semibold text-[oklch(0.18_0.02_260)] text-base mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-[oklch(0.35_0.02_260)]/55 leading-relaxed">
                {service.desc}
              </p>
              {/* Number tag */}
              <span className="absolute top-4 right-4 font-mono-data text-[10px] text-[oklch(0.35_0.02_260)]/15 font-medium">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
