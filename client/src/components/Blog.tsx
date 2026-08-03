import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const blogPosts = [
  {
    title: "How I Built a Medical WordPiece Tokenizer from Scratch",
    category: "NLP",
    excerpt: "A practical breakdown of vocabulary training, subword choices, and clinical text preprocessing.",
    date: "Planned",
  },
  {
    title: "Fine-Tuning BERT for Medication NER",
    category: "AI",
    excerpt: "Dataset generation, entity labels, evaluation traps, and deployment lessons from a medical reminder system.",
    date: "Planned",
  },
  {
    title: "From Notebook to FastAPI: Serving ML Models Properly",
    category: "Backend",
    excerpt: "How to wrap inference, validation, and failure states in an API recruiters can actually inspect.",
    date: "Planned",
  },
  {
    title: "Designing Multi-Tenant SaaS Data Isolation",
    category: "Systems",
    excerpt: "What company-scoped tables, RBAC, audit logs, and period locks look like in an ERP backend.",
    date: "Planned",
  },
  {
    title: "Inventory Optimization Without Overclaiming AI",
    category: "Product",
    excerpt: "How to frame prediction systems honestly with constraints, confidence, and business value.",
    date: "Planned",
  },
  {
    title: "What Makes an AI Portfolio Feel Senior",
    category: "Career",
    excerpt: "A teardown of proof, architecture, metrics, screenshots, and case-study writing.",
    date: "Planned",
  },
];

const categories = ["All Categories", "AI", "NLP", "Backend", "Systems", "Product", "Career"];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filtered = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All Categories" || post.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">
            Technical Writing Roadmap
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Recruiters and senior engineers trust builders who can explain tradeoffs. These article
            slots make the portfolio ready for serious technical writing.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search article ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#111827] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#00d4aa]/50 transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow hover:border-[#00d4aa]/40 transition-all duration-300 group"
            >
              <span className="text-[10px] font-mono-data uppercase tracking-wider text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-1 rounded">
                {post.category}
              </span>
              <h3 className="text-white font-semibold text-base mt-3 mb-2 group-hover:text-[#00d4aa] transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
              <p className="text-gray-600 text-xs font-mono-data">{post.date}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
