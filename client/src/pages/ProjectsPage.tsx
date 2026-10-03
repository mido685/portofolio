import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Github, Layers3, Star } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { projects as localProjects } from "@/data/projects";
import { API_BASE } from "@/lib/apiBase";

type Project = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  stars: number;
  tech: string[];
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
}));

function ProjectCard({ project }: { project: Project }) {
  const rating = Math.max(0, Math.min(5, Math.round(project.stars || 0)));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-primary/15 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_50px_rgba(0,212,170,0.08)]">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={project.image_url || "/placeholder.png"}
          alt={`${project.title} project preview`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 flex gap-1" aria-label={`${rating} out of 5 project strength`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={14} className={index < rating ? "fill-amber-400 text-amber-400" : "text-white/50"} />
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-[10px] font-mono-data uppercase tracking-[0.2em] text-primary">
          <Layers3 size={13} /> Project case study
        </p>
        <h2 className="mt-3 text-xl font-semibold text-foreground">{project.title}</h2>
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech?.slice(0, 6).map((technology) => (
            <span key={technology} className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-mono-data text-primary">
              {technology}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90">
            View case study <ArrowRight size={14} />
          </Link>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
              <Github size={15} />
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load projects");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) setProjects(data.projects);
      })
      .catch(() => setProjects(fallbackProjects));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-foreground">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 pb-20 pt-28">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <Layers3 size={26} />
          </div>
          <p className="mt-6 text-xs font-mono-data uppercase tracking-[0.28em] text-primary">Selected work</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Projects & Case Studies</h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Explore the products, AI systems, and engineering work I have built. Open any case study to see the problem, solution, and technical details.
          </p>
        </header>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
