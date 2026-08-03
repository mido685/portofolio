import { motion } from "framer-motion";

const skillGroups = [
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "NLP / NER", years: "1+", confidence: 88, projects: "Medical Assistant, Tokenizer" },
      { name: "Transformers", years: "1+", confidence: 82, projects: "BioBERT, custom encoder" },
      { name: "Model APIs", years: "1+", confidence: 86, projects: "HuggingFace + FastAPI" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "FastAPI", years: "2+", confidence: 92, projects: "All AI APIs" },
      { name: "REST APIs", years: "2+", confidence: 90, projects: "ERP, model serving" },
      { name: "Auth / RBAC", years: "1+", confidence: 82, projects: "STARK Costing" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", years: "2+", confidence: 86, projects: "Portfolio, SaaS UI" },
      { name: "TypeScript", years: "1+", confidence: 82, projects: "Vercel frontends" },
      { name: "Tailwind CSS", years: "2+", confidence: 88, projects: "All web apps" },
    ],
  },
  {
    category: "Data & Cloud",
    skills: [
      { name: "PostgreSQL", years: "1+", confidence: 84, projects: "Medical reminders, ERP" },
      { name: "Vercel", years: "1+", confidence: 86, projects: "Frontend deployments" },
      { name: "Docker", years: "1+", confidence: 76, projects: "API packaging" },
    ],
  },
];

export default function Technologies() {
  return (
    <section id="technologies" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">
            Engineering Skills
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Not a logo wall. Each capability is tied to time, confidence, and projects where it is
            actually used.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow"
            >
              <h3 className="text-[#00d4aa] font-semibold text-sm mb-5">{group.category}</h3>
              <div className="space-y-5">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-white text-sm font-medium">{skill.name}</span>
                      <span className="text-gray-500 text-xs font-mono-data">{skill.years}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#00d4aa]"
                        style={{ width: `${skill.confidence}%` }}
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{skill.projects}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
