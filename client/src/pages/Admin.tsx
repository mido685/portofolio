import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ImageUp,
  Layers3,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_SECRET_KEY,
  createProject,
  deleteProject,
  listProjects,
  ProjectPayload,
  updateProject,
  uploadProjectImage,
} from "@/lib/adminApi";

const emptyProject: ProjectPayload = {
  slug: "",
  title: "",
  description: "",
  image_url: "",
  github_url: "",
  demo_url: "",
  stars: 5,
  tech: [],
  problem: "",
  solution: "",
  enterprise: [],
  images: [],
};

function AdminLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const dimensions = size === "sm" ? "h-14 w-14" : "h-24 w-24";

  return (
    <div
      className={`${dimensions} overflow-hidden rounded-full border-2 border-primary bg-background shadow-[0_0_28px_rgba(0,212,170,0.35)]`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/stark-logo-poster.png"
        className="h-full w-full scale-[1.55] object-cover"
      >
        <source src="/assets/stark-logo.webm" type="video/webm" />
        <source src="/assets/stark-logo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function listToText(values: string[] | null | undefined) {
  return values?.join("\n") ?? "";
}

function textToList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeProject(project: ProjectPayload): ProjectPayload {
  const images = project.images.filter(Boolean);
  const imageUrl = project.image_url?.trim() || images[0] || null;
  const normalizedImages = imageUrl && !images.includes(imageUrl) ? [imageUrl, ...images] : images;

  return {
    ...project,
    slug: project.slug.trim(),
    title: project.title.trim(),
    description: project.description?.trim() || null,
    image_url: imageUrl,
    github_url: project.github_url?.trim() || null,
    demo_url: project.demo_url?.trim() || null,
    stars: Math.max(0, Math.min(5, Number(project.stars) || 0)),
    tech: project.tech.filter(Boolean),
    problem: project.problem?.trim() || null,
    solution: project.solution?.trim() || null,
    enterprise: project.enterprise.filter(Boolean),
    images: normalizedImages,
  };
}

function completionScore(project: ProjectPayload, techText: string, enterpriseText: string, imagesText: string) {
  const checks = [
    project.slug,
    project.title,
    project.description,
    project.image_url || imagesText,
    project.github_url,
    project.demo_url,
    techText,
    project.problem,
    project.solution,
    enterpriseText,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>;
}

export default function Admin() {
  const [secretInput, setSecretInput] = useState("");
  const [secret, setSecret] = useState(() => sessionStorage.getItem(ADMIN_SECRET_KEY) || "");
  const [projects, setProjects] = useState<ProjectPayload[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("new");
  const [draft, setDraft] = useState<ProjectPayload>(emptyProject);
  const [techText, setTechText] = useState("");
  const [enterpriseText, setEnterpriseText] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedSlug),
    [projects, selectedSlug],
  );

  const score = completionScore(draft, techText, enterpriseText, imagesText);
  const averageStars =
    projects.length > 0
      ? (projects.reduce((total, project) => total + Number(project.stars || 0), 0) / projects.length).toFixed(1)
      : "0.0";

  async function loadProjects() {
    setError("");
    try {
      const data = await listProjects();
      setProjects(data);
      setStatus("Projects synced from the live API.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const next = selectedProject ?? emptyProject;
    setDraft({
      ...next,
      tech: next.tech ?? [],
      enterprise: next.enterprise ?? [],
      images: next.images ?? [],
    });
    setTechText(listToText(next.tech));
    setEnterpriseText(listToText(next.enterprise));
    setImagesText(listToText(next.images));
  }, [selectedProject]);

  function signIn(event: FormEvent) {
    event.preventDefault();
    const value = secretInput.trim();
    if (!value) return;
    sessionStorage.setItem(ADMIN_SECRET_KEY, value);
    setSecret(value);
    setSecretInput("");
  }

  function signOut() {
    sessionStorage.removeItem(ADMIN_SECRET_KEY);
    setSecret("");
    setSelectedSlug("new");
  }

  function setField<K extends keyof ProjectPayload>(key: K, value: ProjectPayload[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveProject(event: FormEvent) {
    event.preventDefault();
    if (!secret) return;

    const project = normalizeProject({
      ...draft,
      tech: textToList(techText),
      enterprise: textToList(enterpriseText),
      images: textToList(imagesText),
    });

    setBusy(true);
    setError("");
    try {
      const saved =
        selectedSlug === "new"
          ? await createProject(secret, project)
          : await updateProject(secret, selectedSlug, project);
      await loadProjects();
      setSelectedSlug(saved.slug);
      setStatus(`Saved "${saved.title}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject() {
    if (!secret || selectedSlug === "new") return;
    if (!confirm("Delete this project permanently? This cannot be undone.")) return;

    setBusy(true);
    setError("");
    try {
      await deleteProject(secret, selectedSlug);
      await loadProjects();
      setSelectedSlug("new");
      setStatus("Project deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File | undefined) {
    if (!file || !secret || selectedSlug === "new") return;

    setBusy(true);
    setError("");
    try {
      const result = await uploadProjectImage(secret, selectedSlug, file);
      await loadProjects();
      setDraft(result.project);
      setImagesText(listToText(result.project.images));
      setStatus("Image uploaded and project cover updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setBusy(false);
    }
  }

  if (!secret) {
    return (
      <main className="min-h-screen bg-[#0a0e1a] text-foreground flex items-center justify-center px-4">
        <form
          onSubmit={signIn}
          className="w-full max-w-md border border-primary/20 bg-card/90 p-7 rounded-xl card-glow"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <div className="mt-6 flex justify-center">
            <AdminLogo />
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold text-primary">STARK AI Admin</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Private project CMS for managing case studies, screenshots, links, and impact copy.
          </p>
          <Input
            className="mt-6"
            type="password"
            value={secretInput}
            onChange={(event) => setSecretInput(event.target.value)}
            placeholder="Admin secret"
            autoFocus
          />
          <Button type="submit" className="mt-4 w-full">
            <ShieldCheck size={16} />
            Unlock Dashboard
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-foreground">
      <div className="container mx-auto max-w-7xl py-8">
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <AdminLogo size="sm" />
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} />
                Back to site
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-primary">Project Control Center</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage the public case studies that power the portfolio.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={loadProjects} disabled={busy}>
              <RefreshCw size={16} />
              Sync
            </Button>
            <Button type="button" variant="outline" onClick={signOut}>
              <LogOut size={16} />
              Lock
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { icon: Layers3, label: "Projects", value: String(projects.length) },
            { icon: Sparkles, label: "Avg strength", value: averageStars },
            { icon: ShieldCheck, label: "Draft readiness", value: `${score}%` },
            { icon: ExternalLink, label: "API", value: "Live" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-primary/15 bg-card p-4">
              <item.icon className="mb-3 h-5 w-5 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {(status || error) && (
          <div
            className={`mt-4 rounded-md border px-4 py-3 text-sm ${
              error ? "border-destructive text-destructive" : "border-primary/40 text-primary"
            }`}
          >
            {error || status}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr_340px]">
          <aside className="h-fit rounded-lg border border-border bg-card p-3">
            <Button type="button" className="w-full" onClick={() => setSelectedSlug("new")}>
              <Plus size={16} />
              New Project
            </Button>
            <div className="mt-4 space-y-2">
              {projects.map((project) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => setSelectedSlug(project.slug)}
                  className={`w-full rounded-md border px-3 py-3 text-left text-sm transition-colors ${
                    selectedSlug === project.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  <span className="block font-medium">{project.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{project.slug}</span>
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {project.tech?.slice(0, 3).join(" / ") || "No stack added"}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={saveProject} className="space-y-5">
            <section className="rounded-lg border border-border bg-card p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Project Identity</h2>
                  <FieldHint>Core fields used by cards, SEO snippets, and case-study headers.</FieldHint>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono-data text-primary">
                  {selectedSlug === "new" ? "New draft" : "Editing live"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span>Slug</span>
                  <Input
                    value={draft.slug}
                    onChange={(event) => setField("slug", event.target.value)}
                    disabled={selectedSlug !== "new"}
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>Title</span>
                  <Input
                    value={draft.title}
                    onChange={(event) => setField("title", event.target.value)}
                    required
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>GitHub URL</span>
                  <Input
                    value={draft.github_url ?? ""}
                    onChange={(event) => setField("github_url", event.target.value)}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>Demo URL</span>
                  <Input
                    value={draft.demo_url ?? ""}
                    onChange={(event) => setField("demo_url", event.target.value)}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>Strength rating</span>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    value={draft.stars}
                    onChange={(event) => setField("stars", Number(event.target.value))}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>Cover image URL</span>
                  <Input
                    value={draft.image_url ?? ""}
                    onChange={(event) => setField("image_url", event.target.value)}
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2 text-sm">
                <span>Description</span>
                <Textarea
                  value={draft.description ?? ""}
                  onChange={(event) => setField("description", event.target.value)}
                  rows={4}
                  placeholder="Explain the product, stack, and why it matters in 2-4 sharp sentences."
                />
              </label>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">Case Study Content</h2>
              <FieldHint>These fields make the project feel senior: problem, solution, impact, and architecture proof.</FieldHint>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span>Problem</span>
                  <Textarea
                    value={draft.problem ?? ""}
                    onChange={(event) => setField("problem", event.target.value)}
                    rows={6}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>Solution</span>
                  <Textarea
                    value={draft.solution ?? ""}
                    onChange={(event) => setField("solution", event.target.value)}
                    rows={6}
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm">
                  <span>Tech stack</span>
                  <Textarea value={techText} onChange={(event) => setTechText(event.target.value)} rows={7} />
                  <FieldHint>One item per line or comma-separated.</FieldHint>
                </label>
                <label className="space-y-2 text-sm">
                  <span>Enterprise impact</span>
                  <Textarea
                    value={enterpriseText}
                    onChange={(event) => setEnterpriseText(event.target.value)}
                    rows={7}
                  />
                  <FieldHint>Use concrete outcomes or honest expected value.</FieldHint>
                </label>
                <label className="space-y-2 text-sm">
                  <span>Gallery images</span>
                  <Textarea value={imagesText} onChange={(event) => setImagesText(event.target.value)} rows={7} />
                  <FieldHint>One URL per line. First image becomes the main screenshot.</FieldHint>
                </label>
              </div>
            </section>

            <section className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Project
              </Button>
              <label
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm ${
                  selectedSlug === "new" ? "opacity-50" : "hover:bg-secondary"
                }`}
              >
                <ImageUp size={16} />
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busy || selectedSlug === "new"}
                  onChange={(event) => uploadImage(event.target.files?.[0])}
                />
              </label>
              {selectedSlug !== "new" && (
                <Button type="button" variant="destructive" onClick={removeProject} disabled={busy}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              )}
            </section>
          </form>

          <aside className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Public Preview</h2>
                <FieldHint>How the project will feel in the portfolio.</FieldHint>
              </div>
              <span className="text-xs font-mono-data text-primary">{score}%</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-primary/20 bg-[#111827]">
              <div className="aspect-video bg-secondary">
                {draft.image_url || imagesText ? (
                  <img
                    src={draft.image_url || textToList(imagesText)[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image yet
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-yellow-400">{"*".repeat(Math.max(0, Number(draft.stars) || 0))}</p>
                <h3 className="mt-2 font-bold text-primary">{draft.title || "Project title"}</h3>
                <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                  {draft.description || "Project description preview will appear here."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {textToList(techText)
                    .slice(0, 5)
                    .map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-mono-data text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={draft.github_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-xs text-foreground"
                  >
                    <Github size={13} />
                    Code
                  </a>
                  <a
                    href={draft.demo_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground"
                  >
                    Demo
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
