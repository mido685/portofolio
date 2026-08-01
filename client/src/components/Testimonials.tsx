import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "STARK AI transformed our customer support system with their intelligent chatbot. The accuracy and speed are impressive.",
    name: "Sarah Johnson",
    role: "CEO, TechCorp",
    stars: 5,
    initials: "SJ",
  },
  {
    quote: "The NLP solutions provided by STARK AI have significantly improved our data processing capabilities.",
    name: "Michael Chen",
    role: "CTO, DataFlow Inc.",
    stars: 4,
    initials: "MC",
  },
  {
    quote: "Professional, innovative, and results-driven. STARK AI exceeded our expectations on every project.",
    name: "Emma Williams",
    role: "Product Manager, AI Solutions",
    stars: 5,
    initials: "EW",
  },
  {
    quote: "Their expertise in machine learning and AI automation has been invaluable to our organization.",
    name: "David Park",
    role: "Engineering Lead, AutoScale",
    stars: 5,
    initials: "DP",
  },
  {
    quote: "Excellent team with deep knowledge of AI systems. Delivered on time and beyond expectations.",
    name: "Omar Habash",
    role: "Director, NeuralPath",
    stars: 5,
    initials: "OH",
  },
  {
    quote: "The AI solutions from STARK AI are top-notch. Their NLP models are accurate and reliable.",
    name: "Mohamed Osama",
    role: "Lead Developer, SmartAI",
    stars: 5,
    initials: "MO",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < count ? "text-yellow-400" : "text-gray-600"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          What Our Clients Say
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow hover:border-[#00d4aa]/40 transition-all duration-300"
            >
              <p className="text-gray-400 text-sm italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
              <div className="mt-3">
                <StarRating count={t.stars} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
