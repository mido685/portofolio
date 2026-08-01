import { motion } from "framer-motion";

const skills = [
  { icon: "🤖", title: "Artificial Intelligence", desc: "Advanced AI models and algorithms" },
  { icon: "💬", title: "Natural Language Processing", desc: "Understanding and processing human language" },
  { icon: "🔧", title: "AI Assistants", desc: "Intelligent conversational systems" },
  { icon: "⚙️", title: "Automation Systems", desc: "Smart workflow automation" },
  { icon: "📊", title: "Machine Learning", desc: "Data-driven intelligent solutions" },
  { icon: "🧠", title: "Deep Learning", desc: "Neural networks and transformers" },
];

export default function About() {
  return (
    <section id="about" className="pt-12 pb-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          About STARK AI
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gray-300 text-base leading-relaxed mb-12 max-w-4xl mx-auto text-center"
        >
          STARK AI specializes in developing intelligent systems that leverage the power of
          artificial intelligence and machine learning. Our expertise spans across multiple
          domains including Natural Language Processing, AI-powered assistants, and automation
          systems. We are committed to building solutions that are not only technologically
          advanced but also practical and scalable for real-world applications.
        </motion.p>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-5 text-center card-glow hover:border-[#00d4aa]/40 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{skill.icon}</div>
              <h4 className="text-[#00d4aa] font-semibold text-sm mb-1">{skill.title}</h4>
              <p className="text-gray-500 text-xs">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}