import { motion } from "framer-motion";
import { Award, BookOpen, Code2, GitPullRequest, Mic2, Trophy } from "lucide-react";

const achievements = [
  {
    icon: Code2,
    title: "Open Source",
    detail: "Published AI/NLP projects with readable source, live demos, and deployable APIs.",
    status: "Active",
  },
  {
    icon: Award,
    title: "Certifications",
    detail: "Focused learning path across Python, machine learning, backend APIs, and deployment.",
    status: "Add credentials",
  },
  {
    icon: Trophy,
    title: "Competitions",
    detail: "Portfolio-ready space for hackathons, model challenges, and product builds.",
    status: "Upcoming",
  },
  {
    icon: BookOpen,
    title: "Research",
    detail: "Hands-on transformer, tokenization, BioBERT, and retrieval-augmented system studies.",
    status: "Ongoing",
  },
  {
    icon: GitPullRequest,
    title: "Engineering Notes",
    detail: "Technical writing pipeline for model serving, clinical NLP, and multi-tenant SaaS.",
    status: "Drafting",
  },
  {
    icon: Mic2,
    title: "Community",
    detail: "Placeholder for mentoring, talks, articles, and public learning logs.",
    status: "Next",
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-mono-data uppercase tracking-[0.25em] text-gray-500 mb-3">
            Beyond The Code
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">
            Achievements & Signals
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            A recruiter should see momentum, public proof, and technical curiosity. This section is
            built to grow as certifications, articles, and community work are added.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow hover:border-[#00d4aa]/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="w-11 h-11 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <span className="text-[10px] font-mono-data uppercase tracking-wider text-gray-500 border border-gray-700 rounded-full px-2.5 py-1">
                  {item.status}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
