import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  Github,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Building2,
} from "lucide-react";
import CtaSection from "@/components/CtaSection";

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

const API_BASE = "https://portofolio-theta-jet-96.vercel.app";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < count ? "text-yellow-400" : "text-muted-foreground/30"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
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
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">Loading...</p>
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-4xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        {/* Header */}
        <div className="mt-8">
          <StarRating count={project.stars} />
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground">
            {project.title}
          </h1>
          <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech?.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-secondary text-primary border border-border rounded-full font-mono-data"
              >
                {t}
              </span>
            ))}
          </div>

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

        {/* Photo gallery */}
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
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-primary" : "border-border"
                  }`}
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

        {/* Problem / Solution / Enterprise Impact */}
        <div className="mt-16 space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-400" />
              <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
                The Problem
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-primary" />
              <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
                The Solution
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={18} className="text-primary" />
              <h2 className="font-display font-bold text-foreground text-lg uppercase tracking-wide">
                Enterprise Impact
              </h2>
            </div>
            <ul className="space-y-2.5">
              {project.enterprise?.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                  <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CtaSection />
      </div>
    </div>
  );
}
