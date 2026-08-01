import { motion } from "framer-motion";
import { Link } from "wouter";
import { Github, ExternalLink, BarChart3, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Project = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string;
  demo_url: string;
  stars: number;
  tech: string[];
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < count ? "text-yellow-400" : "text-gray-600"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

const API_BASE = "https://portofolio-theta-jet-96.vercel.app";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data.projects))
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  async function handleFileChange(slug: string, file: File) {
    setUploadingSlug(slug);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/api/projects/${slug}/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setProjects((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, image_url: data.imageUrl } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingSlug(null);
    }
  }

  return (
    <section id="projects" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          Featured Projects
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg overflow-hidden card-glow hover:border-[#00d4aa]/40 transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image_url || "/placeholder.png"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[project.slug] = el)}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(project.slug, file);
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[project.slug]?.click()}
                  disabled={uploadingSlug === project.slug}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs rounded-md backdrop-blur-sm transition-all disabled:opacity-50"
                >
                  <Upload size={12} />
                  {uploadingSlug === project.slug ? "Uploading..." : "Change Photo"}
                </button>
              </div>

              <div className="p-5">
                <StarRating count={project.stars} />

                <h3 className="text-[#00d4aa] font-bold text-lg mt-2 mb-3">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech?.map((t, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-1 text-xs bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20 rounded-full font-mono-data"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-medium rounded-md hover:bg-[#00d4aa]/20 transition-all border border-[#00d4aa]/20"
                  >
                    <BarChart3 size={14} />
                    View Impact
                  </Link>
                  
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-md hover:bg-gray-600/50 transition-all"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                  
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-medium rounded-md hover:bg-[#00d4aa]/20 transition-all border border-[#00d4aa]/20"
                  >
                    Live Demo
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}