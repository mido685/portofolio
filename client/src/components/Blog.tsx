import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const blogPosts = [
  {
    title: "Building a WordPiece Tokenizer from Scratch",
    category: "NLP",
    excerpt: "A deep dive into implementing the WordPiece algorithm used in BERT and BioBERT for medical NLP applications.",
    date: "2024-01-15",
  },
  {
    title: "Fine-Tuning BERT for Medical NER",
    category: "AI",
    excerpt: "How we trained a BERT model on 28 clinical domains to extract drug names, doses, and frequencies from natural language.",
    date: "2024-02-10",
  },
  {
    title: "AI-Powered Inventory Optimization",
    category: "AI",
    excerpt: "Using machine learning to predict optimal order quantities based on consumption patterns and cost data.",
    date: "2024-03-05",
  },
  {
    title: "Deploying NLP Models with FastAPI",
    category: "Tutorial",
    excerpt: "A comprehensive guide to deploying production-ready NLP models using FastAPI and HuggingFace Spaces.",
    date: "2024-03-20",
  },
  {
    title: "The Future of Conversational AI",
    category: "News",
    excerpt: "Exploring the latest trends in conversational AI and how they're reshaping customer engagement.",
    date: "2024-04-01",
  },
  {
    title: "RAG Pipeline Best Practices",
    category: "Tutorial",
    excerpt: "Building robust Retrieval-Augmented Generation pipelines for enterprise knowledge bases.",
    date: "2024-04-15",
  },
];

const categories = ["All Categories", "AI", "NLP", "Tutorial", "News"];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filtered = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All Categories" || post.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-12"
        >
          Articles & Insights
        </motion.h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
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
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={i}
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
              <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
              <a href="#" className="text-[#00d4aa] text-sm font-medium hover:underline">
                Read More →
              </a>
              <p className="text-gray-600 text-xs mt-3">{post.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
