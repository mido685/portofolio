import { motion } from "framer-motion";
import { Link } from "wouter";
import { Github, ExternalLink, BarChart3, GitBranch } from "lucide-react";
import { useState, useEffect } from "react";
import { projects as localProjects } from "@/data/projects";
import { API_BASE } from "@/lib/apiBase";

type Project = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string;
  demo_url: string;
  stars: number;
  tech: string[];
  problem?: string;
  solution?: string;
  enterprise?: string[];
};

const fallbackProjects: Project[] = localProjects.map((project) => ({
  slug: project.slug,
  title: project.title,
  description: project.description,
  image_url: project.image,
  github_url: project.github,
  demo_url: project.demo,
  stars: project.stars,
  tech: project.tech,
  problem: project.problem,
  solution: project.solution,
  enterprise: project.enterprise,
}));

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 project strength`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < count ? "text-yellow-400" : "text-gray-600"}`}>
          *
        </span>
      ))}
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => setProjects(fallbackProjects));
  }, []);

  return (
    <section id="projects" className="py-24 bg-[#0d1117]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono-data uppercase tracking-[0.25em] text-gray-500 mb-3">
            Case Studies
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">
            Featured AI Systems
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Each project is framed as an engineering case study: problem, architecture, role,
            decisions, impact, and lessons learned.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg overflow-hidden card-glow hover:border-[#00d4aa]/40 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image_url || "/placeholder.png"}
                  alt={`${project.title} interface screenshot`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <StarRating count={project.stars} />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[#00d4aa] font-bold text-lg mb-3">{project.title}</h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4">
                  {project.description}
                </p>

                <div className="rounded-lg border border-[#00d4aa]/10 bg-[#00d4aa]/5 p-3 mb-4">
                  <div className="flex items-center gap-2 text-[#00d4aa] text-xs font-mono-data uppercase tracking-wide mb-2">
                    <GitBranch size={14} />
                    Architecture signal
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {project.solution || "Model/API/frontend architecture documented in the case study."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech?.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20 rounded-full font-mono-data"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-medium rounded-md hover:bg-[#00d4aa]/20 transition-all border border-[#00d4aa]/20"
                  >
                    <BarChart3 size={14} />
                    Case
                  </Link>

                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-700/50 text-gray-300 text-xs font-medium rounded-md hover:bg-gray-600/50 transition-all"
                  >
                    <Github size={14} />
                    Code
                  </a>

                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-medium rounded-md hover:bg-[#00d4aa]/20 transition-all border border-[#00d4aa]/20"
                  >
                    Demo
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
