import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, Compass, Target } from "lucide-react";

const nowItems = [
  {
    icon: BrainCircuit,
    label: "Current AI Project",
    value: "Clinical NLP assistant: tokenizer, NER model, reminders, and deployable API.",
  },
  {
    icon: Compass,
    label: "Learning",
    value: "Production RAG, evaluation pipelines, agent workflows, and observability.",
  },
  {
    icon: BookOpen,
    label: "Reading",
    value: "Transformer architecture notes, system design, and applied ML deployment patterns.",
  },
  {
    icon: Target,
    label: "2026 Goal",
    value: "Ship AI systems that move from demo to daily operational use.",
  },
];

export default function CurrentlyBuilding() {
  return (
    <section id="now" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono-data uppercase tracking-[0.25em] text-gray-500 mb-3">
              Now
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa] mb-5">
              Currently Building
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The work in progress matters because it shows direction: applied AI, backend rigor,
              and systems that can be tested, deployed, observed, and improved.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {nowItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow"
              >
                <item.icon className="w-5 h-5 text-[#00d4aa] mb-4" />
                <h3 className="text-white font-semibold text-sm mb-2">{item.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
