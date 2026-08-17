import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  Github,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Building2,
  Cpu,
  UserCheck,
  Wrench,
  GraduationCap,
} from "lucide-react";
import CtaSection from "@/components/CtaSection";
import { projects as localProjects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/apiBase";

type Project = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  images?: string[];
  github_url: string;
  demo_url: string;
  stars: number;
  tech: string[];
  problem: string;
  solution: string;
  enterprise: string[];
};

const fallbackProjects: Project[] = localProjects.map((project) => ({
  slug: project.slug,
  title: project.title,
  description: project.description,
  image_url: project.image,
  images: project.images,
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
        <span
          key={i}
          className={`text-sm ${i < count ? "text-yellow-400" : "text-muted-foreground/30"}`}
        >
          *
        </span>
      ))}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(() =>
    fallbackProjects.find((item) => item.slug === slug) || null,
  );
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE}/api/projects/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setProject(data))
      .catch(() => {
        setProject(fallbackProjects.find((item) => item.slug === slug) || null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">Loading case study...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl font-bold">Project not found</h1>
        <Link href="/" className="mt-4 text-primary hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const gallery =
    project.images && project.images.length > 0
      ? project.images
      : [project.image_url || "/placeholder.png"];

  const architecture = [
    "User-facing React/Vercel interface",
    "FastAPI service layer for validation and inference",
    "Model or algorithm package isolated behind API contracts",
    "Persistence, reminders, or proxy layer depending on product needs",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-5xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <div className="mt-8 grid lg:grid-cols-[1fr_0.8fr] gap-10 items-start">
          <div>
            <StarRating count={project.stars} />
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-foreground">
              {project.title}
            </h1>
            <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-foreground text-sm font-medium rounded-md hover:bg-secondary/70 transition-colors border border-border"
              >
                <Github size={16} />
                GitHub
              </a>

              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Live Demo
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 card-glow">
            <h2 className="font-display text-lg font-bold text-primary mb-4">
              Case Study Snapshot
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">My role</p>
                <p className="text-foreground mt-1">
                  Solo AI engineer, backend engineer, and product builder.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">
                  Business need
                </p>
                <p className="text-foreground mt-1">{project.problem}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {project.tech?.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs bg-secondary text-primary border border-border rounded-full font-mono-data"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <div className="rounded-xl overflow-hidden border border-border bg-card aspect-video">
            <img
              src={gallery[activeImage]}
              alt={`${project.title} screenshot ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-primary" : "border-border"
                  }`}
                  aria-label={`Show screenshot ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${project.title} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          {[
            { icon: AlertTriangle, title: "Problem", body: project.problem },
            { icon: Lightbulb, title: "Solution", body: project.solution },
            {
              icon: UserCheck,
              title: "My Role",
              body: "Owned the product flow, model/backend implementation, API integration, deployment path, and portfolio case-study presentation.",
            },
            {
              icon: Wrench,
              title: "Engineering Decisions",
              body: "Kept model logic behind a service boundary, exposed the capability through a simple API, and paired the backend with a demoable frontend so reviewers can evaluate the work quickly.",
            },
          ].map((section) => (
            <div key={section.title} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <section.icon size={18} className="text-primary" />
                <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
                  {section.title}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={18} className="text-primary" />
              <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
                Architecture
              </h2>
            </div>
            <ul className="space-y-2.5">
              {architecture.map((point) => (
                <li key={point} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                  <span className="text-primary mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={18} className="text-primary" />
              <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
                Impact
              </h2>
            </div>
            <ul className="space-y-2.5">
              {project.enterprise?.map((point) => (
                <li key={point} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                  <span className="text-primary mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap size={18} className="text-primary" />
            <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
              Lessons Learned
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The best portfolio projects are not only technically impressive; they are explainable.
            This project shows how I translate an AI idea into a product path: define the problem,
            isolate the model capability, ship an API, and make the result easy to inspect.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CtaSection />
      </div>
      <Footer />
    </div>
  );
}
