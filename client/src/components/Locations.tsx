/**
 * Locations Section — Branch offices across North America
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Building } from "lucide-react";

const locations = [
  {
    region: "Western New York",
    city: "Buffalo, NY",
    address: "95 Stark St, Buffalo, NY 14150",
    phone: "716-693-4490",
    isHQ: true,
  },
  {
    region: "Central New York",
    city: "Syracuse, NY",
    address: "Serving Central NY Region",
    phone: "",
  },
  {
    region: "Eastern New York",
    city: "Albany, NY",
    address: "Serving Albany Region",
    phone: "",
  },
  {
    region: "New England",
    city: "Boston, MA",
    address: "Serving New England Region",
    phone: "",
  },
  {
    region: "New Hampshire",
    city: "Manchester, NH",
    address: "Serving New Hampshire",
    phone: "",
  },
  {
    region: "New Jersey",
    city: "Jersey City, NJ",
    address: "Serving New Jersey Region",
    phone: "",
  },
  {
    region: "Central Florida",
    city: "Orlando, FL",
    address: "Serving Central Florida",
    phone: "",
  },
  {
    region: "Western Florida",
    city: "Sarasota, FL",
    address: "1901 Baywood Dr, Sarasota, FL 34231",
    phone: "",
  },
];

export default function Locations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="locations" className="py-24 lg:py-32 bg-[oklch(0.18_0.02_260)] relative overflow-hidden">
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
            Our Presence
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mt-3">
            8 Branch Locations{" "}
            <span className="text-[oklch(0.65_0.12_60)]">Across North America</span>
          </h2>
          <p className="text-white/50 mt-4 text-lg">
            Strategically located branches providing localized expertise backed by
            Stark Tech's full-service capabilities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.23, 1, 0.32, 1],
              }}
              className={`p-5 rounded-sm border transition-all duration-300 hover:-translate-y-1 ${
                loc.isHQ
                  ? "border-[oklch(0.65_0.12_60)]/40 bg-[oklch(0.65_0.12_60)]/10 hover:border-[oklch(0.65_0.12_60)]/60"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              {loc.isHQ && (
                <span className="text-[oklch(0.65_0.12_60)] text-xs font-mono-data font-medium uppercase tracking-wider">
                  Headquarters
                </span>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Building className="w-4 h-4 text-[oklch(0.65_0.12_60)]" />
                <h3 className="font-display font-semibold text-white">
                  {loc.region}
                </h3>
              </div>
              <p className="text-sm text-white/50 mt-2">{loc.city}</p>
              {loc.phone && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Phone className="w-3 h-3 text-[oklch(0.65_0.12_60)]" />
                  <span className="text-xs text-[oklch(0.65_0.12_60)] font-mono-data">
                    {loc.phone}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
