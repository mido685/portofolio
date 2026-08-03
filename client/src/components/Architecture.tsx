import { motion } from "framer-motion";

const flowSteps = [
  "User",
  "React UI",
  "API Gateway",
  "FastAPI Backend",
  "Model Service",
  "PostgreSQL / Logs",
];

const qualityGates = [
  "Input validation before inference",
  "Clear API contracts between UI and model logic",
  "Persistent storage where the workflow needs memory",
  "Deployment path designed for demos and production review",
];

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">
            AI System Architecture
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            The portfolio now explains how systems are put together, not only which tools were used.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {flowSteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="bg-[#111827] border border-[#00d4aa]/30 rounded-lg px-5 py-3 text-sm font-medium text-white hover:border-[#00d4aa] transition-all duration-300 card-glow">
                {step}
              </div>
              {i < flowSteps.length - 1 && <span className="text-[#00d4aa] text-lg">-&gt;</span>}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {qualityGates.map((gate, i) => (
            <motion.div
              key={gate}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-[#111827] border border-[#00d4aa]/15 rounded-lg p-5 text-sm text-gray-400 leading-relaxed"
            >
              <span className="text-[#00d4aa] font-mono-data text-xs block mb-2">
                Gate {i + 1}
              </span>
              {gate}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
