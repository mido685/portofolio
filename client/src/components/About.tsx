import { motion } from "framer-motion";
import { BrainCircuit, Layers3, ServerCog, ShieldCheck } from "lucide-react";

const principles = [
  {
    icon: BrainCircuit,
    title: "AI with purpose",
    desc: "Models are useful only when they reduce friction, cost, or risk for real users.",
  },
  {
    icon: ServerCog,
    title: "Backend first",
    desc: "APIs, data boundaries, auth, logs, and deployment are where products become reliable.",
  },
  {
    icon: Layers3,
    title: "Product thinking",
    desc: "Every project starts from the workflow: who uses it, what breaks, and what proves improvement.",
  },
  {
    icon: ShieldCheck,
    title: "Operational quality",
    desc: "I design for maintainability: clear architecture, scoped data, auditability, and testable demos.",
  },
];

const timeline = [
  {
    year: "Start",
    title: "Built the foundation",
    detail: "Python, backend APIs, databases, and frontend delivery became the base layer.",
  },
  {
    year: "AI",
    title: "Moved into applied NLP",
    detail: "Tokenization, transformers, BioBERT, and clinical entity extraction became the focus.",
  },
  {
    year: "Systems",
    title: "Shipped deployable products",
    detail: "FastAPI services, Vercel frontends, PostgreSQL, Telegram integrations, and HuggingFace demos.",
  },
  {
    year: "Now",
    title: "Building production-grade AI",
    detail: "Combining model work, product UX, and backend engineering into complete systems.",
  },
];

export default function About() {
  return (
    <section id="about" className="pt-12 pb-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          About Mohamed / STARK AI
        </motion.h2>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-7 card-glow"
          >
            <p className="text-gray-300 text-base leading-relaxed">
              I am Mohamed Ibrahim, an AI engineer and full-stack builder focused on the
              intersection of language models, backend systems, and real business workflows. I got
              into AI because language is where many operational problems hide: unclear medical
              instructions, messy inventory decisions, unstructured knowledge, and slow manual
              processes.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mt-5">
              My engineering philosophy is simple: build the smallest system that proves the value,
              then harden the parts that matter - data model, API contract, security,
              observability, and user flow. A model should not be a magic trick; it should be one
              dependable component inside a complete product.
            </p>
          </motion.div>

          <div className="space-y-4">
            {timeline.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="w-16 shrink-0 text-[#00d4aa] text-xs font-mono-data pt-1">
                  {item.year}
                </div>
                <div className="border-l border-[#00d4aa]/25 pl-4 pb-4">
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {principles.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-5 text-center card-glow hover:border-[#00d4aa]/40 transition-all duration-300"
            >
              <skill.icon className="w-7 h-7 text-[#00d4aa] mx-auto mb-4" />
              <h4 className="text-[#00d4aa] font-semibold text-sm mb-1">{skill.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
