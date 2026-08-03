import { motion } from "framer-motion";

const testimonials = [
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

export default function Testimonials() {
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
            No fake praise. These are intentionally marked placeholders until real references are
            collected.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow hover:border-[#00d4aa]/40 transition-all duration-300"
            >
              <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-1 rounded">
                {t.status}
              </span>
              <p className="text-gray-400 text-sm italic my-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
