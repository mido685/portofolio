import { motion } from "framer-motion";

const flowSteps = [
  "User",
  "Web Interface",
  "FastAPI Backend",
  "NLP Model",
  "Database",
  "Notification System",
];

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          AI System Architecture
        </motion.h2>

        {/* Flow Diagram */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {flowSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="bg-[#111827] border border-[#00d4aa]/30 rounded-lg px-5 py-3 text-sm font-medium text-white hover:border-[#00d4aa] transition-all duration-300 card-glow">
                {step}
              </div>
              {i < flowSteps.length - 1 && (
                <span className="text-[#00d4aa] text-lg">→</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 text-center max-w-2xl mx-auto text-sm leading-relaxed"
        >
          Our architecture is designed for scalability, reliability, and performance. Each component
          is optimized to handle complex AI operations while maintaining low latency and high throughput.
        </motion.p>
      </div>
    </section>
  );
}
