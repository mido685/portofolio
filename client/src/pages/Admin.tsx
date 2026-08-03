import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ImageUp,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
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
    <video
      autoPlay
      loop
      muted
      playsInline
      poster="/assets/stark-logo-poster.png"
      className={`${dimensions} rounded-full border-2 border-primary bg-background object-contain shadow-[0_0_28px_rgba(0,212,170,0.35)]`}
    >
      <source src="/assets/stark-logo.webm" type="video/webm" />
      <source src="/assets/stark-logo.mp4" type="video/mp4" />
    </video>
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
  const imageUrl = project.image_url?.trim() || project.images[0] || null;
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
    images: project.images.filter(Boolean),
  };
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
    [projects, selectedSlug]
  );

  async function loadProjects() {
    setError("");
    try {
      const data = await listProjects();
      setProjects(data);
      setStatus("Projects loaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const next = selectedProject ?? emptyProject;
    setDraft({ ...next, tech: next.tech ?? [], enterprise: next.enterprise ?? [], images: next.images ?? [] });
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
      setStatus(`Saved ${saved.title}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject() {
    if (!secret || selectedSlug === "new") return;
    if (!confirm("Delete this project permanently?")) return;

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
      setStatus("Image uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setBusy(false);
    }
  }

  if (!secret) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <form onSubmit={signIn} className="w-full max-w-sm border border-border bg-card p-6 rounded-lg">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <div className="mt-6 flex justify-center">
            <AdminLogo />
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold text-primary">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the backend admin secret to manage portfolio projects.
          </p>
          <Input
            className="mt-5"
            type="password"
            value={secretInput}
            onChange={(event) => setSecretInput(event.target.value)}
            placeholder="Admin secret"
            autoFocus
          />
          <Button type="submit" className="mt-4 w-full">Unlock</Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-7xl py-8">
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <AdminLogo size="sm" />
            <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} />
              Back to site
            </Link>
            <h1 className="mt-3 text-3xl font-bold text-primary">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={loadProjects}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button type="button" variant="outline" onClick={signOut}>
              <LogOut size={16} />
              Lock
            </Button>
          </div>
        </div>

        {(status || error) && (
          <div className={`mt-4 rounded-md border px-4 py-3 text-sm ${error ? "border-destructive text-destructive" : "border-primary/40 text-primary"}`}>
            {error || status}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="border border-border bg-card rounded-lg p-3 h-fit">
            <Button type="button" className="w-full" onClick={() => setSelectedSlug("new")}>
              <Plus size={16} />
              New Project
            </Button>
            <div className="mt-3 space-y-2">
              {projects.map((project) => (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => setSelectedSlug(project.slug)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    selectedSlug === project.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  <span className="block font-medium">{project.title}</span>
                  <span className="block text-xs text-muted-foreground">{project.slug}</span>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={saveProject} className="border border-border bg-card rounded-lg p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Slug</span>
                <Input value={draft.slug} onChange={(event) => setField("slug", event.target.value)} disabled={selectedSlug !== "new"} required />
              </label>
              <label className="space-y-2 text-sm">
                <span>Title</span>
                <Input value={draft.title} onChange={(event) => setField("title", event.target.value)} required />
              </label>
              <label className="space-y-2 text-sm">
                <span>GitHub URL</span>
                <Input value={draft.github_url ?? ""} onChange={(event) => setField("github_url", event.target.value)} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Demo URL</span>
                <Input value={draft.demo_url ?? ""} onChange={(event) => setField("demo_url", event.target.value)} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Stars</span>
                <Input type="number" min={0} max={5} value={draft.stars} onChange={(event) => setField("stars", Number(event.target.value))} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Image URL</span>
                <Input value={draft.image_url ?? ""} onChange={(event) => setField("image_url", event.target.value)} />
              </label>
            </div>

            <label className="mt-4 block space-y-2 text-sm">
              <span>Description</span>
              <Textarea value={draft.description ?? ""} onChange={(event) => setField("description", event.target.value)} rows={4} />
            </label>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm">
                <span>Tech</span>
                <Textarea value={techText} onChange={(event) => setTechText(event.target.value)} rows={6} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Enterprise Impact</span>
                <Textarea value={enterpriseText} onChange={(event) => setEnterpriseText(event.target.value)} rows={6} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Gallery Images</span>
                <Textarea value={imagesText} onChange={(event) => setImagesText(event.target.value)} rows={6} />
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Problem</span>
                <Textarea value={draft.problem ?? ""} onChange={(event) => setField("problem", event.target.value)} rows={5} />
              </label>
              <label className="space-y-2 text-sm">
                <span>Solution</span>
                <Textarea value={draft.solution ?? ""} onChange={(event) => setField("solution", event.target.value)} rows={5} />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Project
              </Button>
              <label className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm ${selectedSlug === "new" ? "opacity-50" : "hover:bg-secondary"}`}>
                <ImageUp size={16} />
                Upload Image
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
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
