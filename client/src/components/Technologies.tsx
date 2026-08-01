import { motion } from "framer-motion";

const technologies = [
  { icon: "🐍", name: "Python" },
  { icon: "🤖", name: "Machine Learning" },
  { icon: "💬", name: "NLP" },
  { icon: "⚡", name: "FastAPI" },
  { icon: "🔄", name: "Transformers" },
  { icon: "🧠", name: "Neural Networks" },
  { icon: "🔌", name: "APIs" },
  { icon: "💾", name: "Databases" },
];

export default function Technologies() {
  return (
    <section id="technologies" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          Technologies & Tools
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {technologies.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#111827] border border-[#00d4aa]/10 rounded-lg p-6 text-center card-glow hover:border-[#00d4aa]/30 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{tech.icon}</div>
              <p className="text-[#00d4aa] text-sm font-medium font-mono-data">
                {tech.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
