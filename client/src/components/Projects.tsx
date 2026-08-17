import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { listTestimonials, TestimonialPayload } from "@/lib/adminApi";

const fallbackTestimonials = [
  {
    quote:
      "Placeholder for a verified client or collaborator quote about delivery quality, communication, and production mindset.",
    name: "Verified collaborator",
    role: "Add company / role",
    status: "Pending quote",
    initials: "VC",
  },
  {
    quote:
      "Use this space for a technical reviewer who can speak to code quality, architecture, and problem solving.",
    name: "Technical reviewer",
    role: "Senior engineer / mentor",
    status: "Pending quote",
    initials: "TR",
  },
  {
    quote:
      "Use this space for a product stakeholder who can speak to business value and user impact.",
    name: "Product stakeholder",
    role: "Founder / operator",
    status: "Pending quote",
    initials: "PS",
  },
];

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRow({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="mt-1.5 flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < value ? "fill-[#f5c518] text-[#f5c518]" : "fill-transparent text-gray-600"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialPayload[]>([]);

  useEffect(() => {
    listTestimonials()
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  }, []);

  const visibleTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const hasLiveTestimonials = testimonials.length > 0;

  return (
    <section id="testimonials" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">
            Testimonials
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            {hasLiveTestimonials
              ? "Client feedback and collaborator notes from recent portfolio work."
              : "No fake praise. These are intentionally marked placeholders until real references are collected."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {visibleTestimonials.map((t, i) => {
            const rating = "rating" in t ? Number(t.rating) || 0 : 0;
            const isPending = "status" in t;

            return (
              <motion.div
                key={`${t.name}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative overflow-hidden bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow hover:border-[#00d4aa]/40 transition-all duration-300"
              >
                {/* mirror / shine sweep */}
                <div
                  className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[120%]"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  {isPending && (
                    <span className="mb-4 inline-block text-[10px] font-mono-data uppercase tracking-wider text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-1 rounded">
                      {(t as { status: string }).status}
                    </span>
                  )}

                  <p className="text-gray-400 text-sm italic leading-relaxed">
                    &quot;{t.quote}&quot;
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] font-bold text-sm">
                      {"initials" in t ? t.initials : initialsFor(t.name)}
                    </div>
                    <div>
                      <p className="text-[#00d4aa] text-sm font-semibold">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                      {!isPending && <StarRow rating={rating} />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}