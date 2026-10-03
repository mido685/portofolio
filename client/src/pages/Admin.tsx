import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  FileText,
  Github,
  Layers3,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_SECRET_KEY,
  ArticlePayload,
  CertificationPayload,
  CommentPayload,
  createArticle,
  createCertification,
  createProject,
  createTestimonial,
  deleteArticle,
  deleteCertification,
  deleteComment,
  deleteProject,
  deleteTestimonial,
  isAdminAuthError,
  listArticles,
  listCertifications,
  listComments,
  listAdminTestimonials,
  listProjects,
  ProjectPayload,
  TestimonialPayload,
  updateArticle,
  updateCertification,
  updateCommentStatus,
  updateProject,
  updateTestimonial,
  uploadArticleCoverImage,
  uploadCertificationFile,
  uploadProjectImage,
  uploadProjectImages,
  verifyAdminSecret,
} from "@/lib/adminApi";

type AdminSection = "projects" | "articles" | "certifications" | "comments" | "testimonials";

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

const emptyArticle: ArticlePayload = {
  slug: "",
  title: "",
  category: "Engineering",
  excerpt: "",
  content: "",
  cover_image_url: "",
  published: false,
};

const emptyTestimonial: TestimonialPayload = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
  approved: true,
  display_order: 0,
};

const emptyCertification: CertificationPayload = {
  category: "certification",
  title: "",
  issuer: "",
  issue_date: "",
  credential_id: "",
  credential_url: "",
  file_url: "",
  description: "",
  published: false,
};

const MAX_GALLERY_IMAGES = 10;
const MAX_GALLERY_IMAGE_SIZE = 5 * 1024 * 1024;
const GALLERY_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function listToText(values: string[] | null | undefined) {
  return values?.join("\n") ?? "";
}

function textToList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>;
}

function AdminLogo() {
  return (
    <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary bg-background shadow-[0_0_28px_rgba(0,212,170,0.35)]">
      <video autoPlay loop muted playsInline poster="/assets/stark-logo-poster.png" className="h-full w-full scale-[1.55] object-cover">
        <source src="/assets/stark-logo.webm" type="video/webm" />
        <source src="/assets/stark-logo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function Admin() {
  const [secretInput, setSecretInput] = useState("");
  const [secret, setSecret] = useState("");
  const [checkingSavedSecret, setCheckingSavedSecret] = useState(() => Boolean(sessionStorage.getItem(ADMIN_SECRET_KEY)));
  const [section, setSection] = useState<AdminSection>("projects");
  const [projects, setProjects] = useState<ProjectPayload[]>([]);
  const [articles, setArticles] = useState<ArticlePayload[]>([]);
  const [comments, setComments] = useState<CommentPayload[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialPayload[]>([]);
  const [certifications, setCertifications] = useState<CertificationPayload[]>([]);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState("new");
  const [selectedArticleSlug, setSelectedArticleSlug] = useState("new");
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<number | "new">("new");
  const [selectedCertificationId, setSelectedCertificationId] = useState<number | "new">("new");
  const [projectDraft, setProjectDraft] = useState<ProjectPayload>(emptyProject);
  const [articleDraft, setArticleDraft] = useState<ArticlePayload>(emptyArticle);
  const [testimonialDraft, setTestimonialDraft] = useState<TestimonialPayload>(emptyTestimonial);
  const [certificationDraft, setCertificationDraft] = useState<CertificationPayload>(emptyCertification);
  const [techText, setTechText] = useState("");
  const [enterpriseText, setEnterpriseText] = useState("");
  const [galleryDropActive, setGalleryDropActive] = useState(false);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const articleCoverInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const certificationFileInputRef = useRef<HTMLInputElement>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedProjectSlug),
    [projects, selectedProjectSlug],
  );
  const selectedArticle = useMemo(
    () => articles.find((article) => article.slug === selectedArticleSlug),
    [articles, selectedArticleSlug],
  );
  const selectedTestimonial = useMemo(
    () => testimonials.find((testimonial) => testimonial.id === selectedTestimonialId),
    [testimonials, selectedTestimonialId],
  );
  const selectedCertification = useMemo(
    () => certifications.find((certification) => certification.id === selectedCertificationId),
    [certifications, selectedCertificationId],
  );

  async function loadAll() {
    await Promise.all([loadProjects(), loadArticles(), loadTestimonials(), loadCertifications(), secret ? loadComments() : Promise.resolve()]);
  }

  function lockAdmin(message = "Invalid admin secret") {
    sessionStorage.removeItem(ADMIN_SECRET_KEY);
    setSecret("");
    setSecretInput("");
    setProjects([]);
    setArticles([]);
    setComments([]);
    setTestimonials([]);
    setCertifications([]);
    setStatus("");
    setError(message);
  }

  async function loadProjects() {
    try {
      setProjects(await listProjects());
      setStatus("Projects synced.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    }
  }

  async function loadArticles() {
    try {
      setArticles(await listArticles(true));
      setStatus("Articles synced.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load articles.");
    }
  }

  async function loadComments() {
    if (!secret) return;
    try {
      setComments(await listComments(secret));
      setStatus("Comments synced.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load comments.";
      if (isAdminAuthError(err)) lockAdmin(message);
      else setError(message);
    }
  }

  async function loadTestimonials() {
    try {
      setTestimonials(secret ? await listAdminTestimonials(secret) : []);
      setStatus("Testimonials synced.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to load testimonials.");
    }
  }

  async function loadCertifications() {
    try {
      setCertifications(await listCertifications(true, secret));
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to load certifications.");
    }
  }

  useEffect(() => {
    const savedSecret = sessionStorage.getItem(ADMIN_SECRET_KEY);
    if (!savedSecret) {
      setCheckingSavedSecret(false);
      return;
    }

    let active = true;

    async function restoreSession() {
      try {
        await verifyAdminSecret(savedSecret);
        if (active) setSecret(savedSecret);
      } catch (err) {
        sessionStorage.removeItem(ADMIN_SECRET_KEY);
        if (active) setError(err instanceof Error ? err.message : "Saved admin secret is no longer valid.");
      } finally {
        if (active) setCheckingSavedSecret(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (secret) loadAll();
  }, [secret]);

  useEffect(() => {
    const next = selectedProject ?? emptyProject;
    const galleryImages = next.images ?? [];
    const images = next.image_url && !galleryImages.includes(next.image_url)
      ? [next.image_url, ...galleryImages]
      : galleryImages;
    setProjectDraft({ ...next, tech: next.tech ?? [], enterprise: next.enterprise ?? [], images });
    setTechText(listToText(next.tech));
    setEnterpriseText(listToText(next.enterprise));
  }, [selectedProject]);

  useEffect(() => {
    setArticleDraft(selectedArticle ?? emptyArticle);
  }, [selectedArticle]);

  useEffect(() => {
    setTestimonialDraft(selectedTestimonial ?? emptyTestimonial);
  }, [selectedTestimonial]);

  useEffect(() => {
    setCertificationDraft(selectedCertification ?? emptyCertification);
  }, [selectedCertification]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    const value = secretInput.trim();
    if (!value) return;

    setBusy(true);
    setError("");
    setStatus("");

    try {
      await verifyAdminSecret(value);
      sessionStorage.setItem(ADMIN_SECRET_KEY, value);
      setSecret(value);
      setSecretInput("");
    } catch (err) {
      lockAdmin(err instanceof Error ? err.message : "Invalid admin secret");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    lockAdmin("");
  }

  function setProjectField<K extends keyof ProjectPayload>(key: K, value: ProjectPayload[K]) {
    setProjectDraft((current) => ({ ...current, [key]: value }));
  }

  function setArticleField<K extends keyof ArticlePayload>(key: K, value: ArticlePayload[K]) {
    setArticleDraft((current) => ({ ...current, [key]: value }));
  }

  function setTestimonialField<K extends keyof TestimonialPayload>(key: K, value: TestimonialPayload[K]) {
    setTestimonialDraft((current) => ({ ...current, [key]: value }));
  }

  function setCertificationField<K extends keyof CertificationPayload>(key: K, value: CertificationPayload[K]) {
    setCertificationDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveProject(event: FormEvent) {
    event.preventDefault();
    const images = projectDraft.images ?? [];
    const imageUrl = projectDraft.image_url?.trim() || images[0] || null;
    const project: ProjectPayload = {
      ...projectDraft,
      slug: projectDraft.slug.trim(),
      title: projectDraft.title.trim(),
      description: projectDraft.description?.trim() || null,
      image_url: imageUrl,
      github_url: projectDraft.github_url?.trim() || null,
      demo_url: projectDraft.demo_url?.trim() || null,
      stars: Math.max(0, Math.min(5, Number(projectDraft.stars) || 0)),
      tech: textToList(techText),
      problem: projectDraft.problem?.trim() || null,
      solution: projectDraft.solution?.trim() || null,
      enterprise: textToList(enterpriseText),
      images: imageUrl && !images.includes(imageUrl) ? [imageUrl, ...images] : images,
    };

    setBusy(true);
    setError("");
    try {
      const saved =
        selectedProjectSlug === "new"
          ? await createProject(secret, project)
          : await updateProject(secret, selectedProjectSlug, project);
      await loadProjects();
      setSelectedProjectSlug(saved.slug);
      setStatus(`Saved "${saved.title}".`);
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject() {
    if (selectedProjectSlug === "new" || !confirm("Delete this project permanently?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteProject(secret, selectedProjectSlug);
      await loadProjects();
      setSelectedProjectSlug("new");
      setStatus("Project deleted.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadProjectCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || selectedProjectSlug === "new") return;

    setBusy(true);
    setError("");

    try {
      const result = await uploadProjectImage(secret, selectedProjectSlug, file);
      setProjectField("image_url", result.imageUrl);
      setProjectField("images", [result.imageUrl, ...(projectDraft.images ?? []).filter((url) => url !== result.imageUrl)]);
      await loadProjects();
      setStatus("Project image uploaded.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to upload project image.");
    } finally {
      setBusy(false);
    }
  }

  async function addGalleryImages(files: File[]) {
    if (!files.length) return;
    if (selectedProjectSlug === "new") {
      setError("Save the project before uploading gallery images.");
      return;
    }
    if ((projectDraft.images?.length ?? 0) + files.length > MAX_GALLERY_IMAGES) {
      setError(`A project can have up to ${MAX_GALLERY_IMAGES} gallery images.`);
      return;
    }
    const invalidType = files.find((file) => !GALLERY_IMAGE_TYPES.includes(file.type));
    if (invalidType) {
      setError(`${invalidType.name}: choose a JPG, PNG, or WebP image.`);
      return;
    }
    const oversized = files.find((file) => file.size > MAX_GALLERY_IMAGE_SIZE);
    if (oversized) {
      setError(`${oversized.name}: each image must be 5 MB or smaller.`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await uploadProjectImages(secret, selectedProjectSlug, files);
      setProjectField("images", [...(projectDraft.images ?? []), ...result.images]);
      setStatus(`${result.images.length} gallery image${result.images.length === 1 ? "" : "s"} uploaded. Save the project to publish the gallery.`);
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to upload gallery images.");
    } finally {
      setBusy(false);
    }
  }

  function uploadGallerySelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    void addGalleryImages(files);
  }

  function reorderGalleryImages(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= (projectDraft.images?.length ?? 0)) return;
    const images = [...(projectDraft.images ?? [])];
    const [moved] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, moved);
    setProjectField("images", images);
  }

  function removeGalleryImage(index: number) {
    const images = [...(projectDraft.images ?? [])];
    const [removed] = images.splice(index, 1);
    setProjectField("images", images);
    if (projectDraft.image_url === removed) {
      setProjectField("image_url", images[0] ?? "");
    }
  }

  function dropGalleryFiles(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setGalleryDropActive(false);
    void addGalleryImages(Array.from(event.dataTransfer.files));
  }

  async function saveArticle(event: FormEvent) {
    event.preventDefault();
    const article: ArticlePayload = {
      ...articleDraft,
      slug: articleDraft.slug.trim(),
      title: articleDraft.title.trim(),
      category: articleDraft.category.trim() || "Engineering",
      excerpt: articleDraft.excerpt?.trim() || null,
      content: articleDraft.content?.trim() || null,
      cover_image_url: articleDraft.cover_image_url?.trim() || null,
      published: Boolean(articleDraft.published),
    };

    setBusy(true);
    setError("");
    try {
      const saved =
        selectedArticleSlug === "new"
          ? await createArticle(secret, article)
          : await updateArticle(secret, selectedArticleSlug, article);
      await loadArticles();
      setSelectedArticleSlug(saved.slug);
      setStatus(`Saved article "${saved.title}".`);
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to save article.");
    } finally {
      setBusy(false);
    }
  }

  async function removeArticle() {
    if (selectedArticleSlug === "new" || !confirm("Delete this article and its comments permanently?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteArticle(secret, selectedArticleSlug);
      await loadArticles();
      await loadComments();
      setSelectedArticleSlug("new");
      setStatus("Article deleted.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to delete article.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadArticleCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || selectedArticleSlug === "new") return;

    setBusy(true);
    setError("");

    try {
      const result = await uploadArticleCoverImage(secret, selectedArticleSlug, file);
      setArticleField("cover_image_url", result.imageUrl);
      await loadArticles();
      setStatus("Cover image uploaded.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to upload cover image.");
    } finally {
      setBusy(false);
    }
  }

  async function saveTestimonial(event: FormEvent) {
    event.preventDefault();
    const testimonial: TestimonialPayload = {
      ...testimonialDraft,
      name: testimonialDraft.name.trim(),
      role: testimonialDraft.role?.trim() || null,
      quote: testimonialDraft.quote.trim(),
      rating: Math.max(0, Math.min(5, Number(testimonialDraft.rating) || 0)),
      approved: Boolean(testimonialDraft.approved),
      display_order: Number(testimonialDraft.display_order) || 0,
    };

    setBusy(true);
    setError("");

    try {
      const saved =
        selectedTestimonialId === "new"
          ? await createTestimonial(secret, testimonial)
          : await updateTestimonial(secret, selectedTestimonialId, testimonial);
      await loadTestimonials();
      setSelectedTestimonialId(saved.id ?? "new");
      setStatus(`Saved testimonial from "${saved.name}".`);
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to save testimonial.");
    } finally {
      setBusy(false);
    }
  }

  async function removeTestimonial() {
    if (selectedTestimonialId === "new" || !confirm("Delete this testimonial permanently?")) return;
    setBusy(true);
    setError("");

    try {
      await deleteTestimonial(secret, selectedTestimonialId);
      await loadTestimonials();
      setSelectedTestimonialId("new");
      setStatus("Testimonial deleted.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to delete testimonial.");
    } finally {
      setBusy(false);
    }
  }

  async function saveCertification(event: FormEvent) {
    event.preventDefault();
    const certification: CertificationPayload = {
      ...certificationDraft,
      title: certificationDraft.title.trim(),
      issuer: certificationDraft.issuer.trim(),
      issue_date: certificationDraft.issue_date?.trim() || null,
      credential_id: certificationDraft.credential_id?.trim() || null,
      credential_url: certificationDraft.credential_url?.trim() || null,
      file_url: certificationDraft.file_url?.trim() || null,
      description: certificationDraft.description?.trim() || null,
      published: Boolean(certificationDraft.published),
    };

    setBusy(true);
    setError("");
    try {
      const saved = selectedCertificationId === "new"
        ? await createCertification(secret, certification)
        : await updateCertification(secret, selectedCertificationId, certification);
      await loadCertifications();
      setSelectedCertificationId(saved.id ?? "new");
      setStatus(`Saved "${saved.title}".`);
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to save certification.");
    } finally {
      setBusy(false);
    }
  }

  async function removeCertification() {
    if (selectedCertificationId === "new" || !confirm("Delete this credential permanently?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteCertification(secret, selectedCertificationId);
      await loadCertifications();
      setSelectedCertificationId("new");
      setStatus("Credential deleted.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to delete credential.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadCertificationDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || selectedCertificationId === "new") return;
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) {
      setError("Choose a JPG, PNG, WebP, or PDF document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Certificate files must be 10 MB or smaller.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const saved = await uploadCertificationFile(secret, selectedCertificationId, file);
      setCertificationDraft(saved);
      await loadCertifications();
      setStatus("Credential document uploaded.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to upload the credential document.");
    } finally {
      setBusy(false);
    }
  }

  async function moderateComment(id: number, approved: boolean) {
    setBusy(true);
    setError("");
    try {
      await updateCommentStatus(secret, id, approved);
      await loadComments();
      setStatus(approved ? "Comment approved." : "Comment hidden.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to update comment.");
    } finally {
      setBusy(false);
    }
  }

  async function removeComment(id: number) {
    if (!confirm("Delete this comment permanently?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteComment(secret, id);
      await loadComments();
      setStatus("Comment deleted.");
    } catch (err) {
      if (isAdminAuthError(err)) lockAdmin(err.message);
      else setError(err instanceof Error ? err.message : "Failed to delete comment.");
    } finally {
      setBusy(false);
    }
  }

  if (checkingSavedSecret) {
    return (
      <main className="min-h-screen bg-[#0a0e1a] text-foreground flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Checking admin access...</span>
        </div>
      </main>
    );
  }

  if (!secret) {
    return (
      <main className="min-h-screen bg-[#0a0e1a] text-foreground flex items-center justify-center px-4">
        <form onSubmit={signIn} className="w-full max-w-md border border-primary/20 bg-card/90 p-7 rounded-xl card-glow">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back to site
          </Link>
          <div className="mt-6 flex justify-center">
            <AdminLogo />
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold text-primary">STARK AI Admin</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Manage projects, technical articles, and public comments.
          </p>
          <Input className="mt-6" type="password" value={secretInput} onChange={(event) => setSecretInput(event.target.value)} placeholder="Admin secret" autoFocus />
          {error && <div className="mt-4 rounded-md border border-destructive px-4 py-3 text-sm text-destructive">{error}</div>}
          <Button type="submit" className="mt-4 w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck size={16} />}
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
            <AdminLogo />
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} />
                Back to site
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-primary">Portfolio Control Center</h1>
              <p className="mt-1 text-sm text-muted-foreground">Projects, articles, credentials, and comment moderation in one dashboard.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={loadAll} disabled={busy}>
              <RefreshCw size={16} />
              Sync
            </Button>
            <Button type="button" variant="outline" onClick={signOut}>
              <LogOut size={16} />
              Lock
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            { icon: Layers3, label: "Projects", value: String(projects.length) },
            { icon: FileText, label: "Articles", value: String(articles.length) },
            { icon: Award, label: "Credentials", value: String(certifications.length) },
            { icon: MessageSquare, label: "Pending", value: String(comments.filter((comment) => !comment.approved).length) },
            { icon: Sparkles, label: "Testimonials", value: String(testimonials.filter((testimonial) => testimonial.approved).length) },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-primary/15 bg-card p-4">
              <item.icon className="mb-3 h-5 w-5 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: "projects" as const, icon: Layers3, label: "Projects" },
            { id: "articles" as const, icon: FileText, label: "Articles" },
            { id: "certifications" as const, icon: Award, label: "Certifications" },
            { id: "comments" as const, icon: MessageSquare, label: "Comments" },
            { id: "testimonials" as const, icon: Sparkles, label: "Testimonials" },
          ].map((item) => (
            <Button key={item.id} type="button" variant={section === item.id ? "default" : "secondary"} onClick={() => setSection(item.id)}>
              <item.icon size={16} />
              {item.label}
            </Button>
          ))}
        </div>

        {(status || error) && (
          <div className={`mt-4 rounded-md border px-4 py-3 text-sm ${error ? "border-destructive text-destructive" : "border-primary/40 text-primary"}`}>
            {error || status}
          </div>
        )}

        {section === "projects" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr_340px]">
            <aside className="h-fit rounded-lg border border-border bg-card p-3">
              <Button type="button" className="w-full" onClick={() => setSelectedProjectSlug("new")}>
                <Plus size={16} />
                New Project
              </Button>
              <div className="mt-4 space-y-2">
                {projects.map((project) => (
                  <button key={project.slug} type="button" onClick={() => setSelectedProjectSlug(project.slug)} className={`w-full rounded-md border px-3 py-3 text-left text-sm transition-colors ${selectedProjectSlug === project.slug ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                    <span className="block font-medium">{project.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{project.slug}</span>
                    <span className="mt-2 block text-xs text-muted-foreground">{project.tech?.slice(0, 3).join(" / ") || "No stack added"}</span>
                  </button>
                ))}
              </div>
            </aside>

            <form onSubmit={saveProject} className="space-y-5">
              <section className="rounded-lg border border-border bg-card p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Project Identity</h2>
                    <FieldHint>Core fields used by cards and case-study pages.</FieldHint>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono-data text-primary">
                    {selectedProjectSlug === "new" ? "New draft" : "Editing live"}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Slug</span>
                    <Input value={projectDraft.slug} onChange={(event) => setProjectField("slug", event.target.value)} disabled={selectedProjectSlug !== "new"} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Title</span>
                    <Input value={projectDraft.title} onChange={(event) => setProjectField("title", event.target.value)} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>GitHub URL</span>
                    <Input value={projectDraft.github_url ?? ""} onChange={(event) => setProjectField("github_url", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Demo URL</span>
                    <Input value={projectDraft.demo_url ?? ""} onChange={(event) => setProjectField("demo_url", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Strength rating</span>
                    <Input type="number" min={0} max={5} value={projectDraft.stars} onChange={(event) => setProjectField("stars", Number(event.target.value))} />
                  </label>
                  <div className="space-y-2 text-sm">
                    <span>Cover image</span>
                    <div className="flex gap-2">
                      <Input value={projectDraft.image_url ?? ""} onChange={(event) => setProjectField("image_url", event.target.value)} placeholder="Paste image URL or upload a file" />
                      <input ref={projectImageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadProjectCover} className="hidden" />
                      <Button type="button" variant="secondary" onClick={() => projectImageInputRef.current?.click()} disabled={busy || selectedProjectSlug === "new"}>
                        {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                        Upload
                      </Button>
                    </div>
                    {selectedProjectSlug === "new" && <FieldHint>Save the project once before uploading a cover image.</FieldHint>}
                  </div>
                </div>

                <label className="mt-4 block space-y-2 text-sm">
                  <span>Description</span>
                  <Textarea value={projectDraft.description ?? ""} onChange={(event) => setProjectField("description", event.target.value)} rows={4} />
                </label>
              </section>

              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-lg font-semibold text-foreground">Case Study Content</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Problem</span>
                    <Textarea value={projectDraft.problem ?? ""} onChange={(event) => setProjectField("problem", event.target.value)} rows={6} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Solution</span>
                    <Textarea value={projectDraft.solution ?? ""} onChange={(event) => setProjectField("solution", event.target.value)} rows={6} />
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
                    <Textarea value={enterpriseText} onChange={(event) => setEnterpriseText(event.target.value)} rows={7} />
                  </label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span>Gallery images</span>
                      <span className="text-xs text-muted-foreground">{projectDraft.images?.length ?? 0}/{MAX_GALLERY_IMAGES}</span>
                    </div>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={uploadGallerySelection}
                      className="hidden"
                    />
                    <div
                      onDragEnter={(event) => {
                        if (event.dataTransfer.types.includes("Files")) setGalleryDropActive(true);
                      }}
                      onDragOver={(event) => {
                        if (event.dataTransfer.types.includes("Files")) {
                          event.preventDefault();
                          setGalleryDropActive(true);
                        }
                      }}
                      onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setGalleryDropActive(false);
                      }}
                      onDrop={dropGalleryFiles}
                      className={`rounded-lg border border-dashed p-3 transition-colors ${galleryDropActive ? "border-primary bg-primary/10" : "border-border bg-background/40"}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">Upload screenshots</p>
                          <FieldHint>Drop files here or choose images. JPG, PNG, or WebP; up to 5 MB each.</FieldHint>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={busy || selectedProjectSlug === "new" || (projectDraft.images?.length ?? 0) >= MAX_GALLERY_IMAGES}
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload size={16} />}
                          Upload images
                        </Button>
                      </div>
                      {selectedProjectSlug === "new" && <p className="mt-2 text-xs text-muted-foreground">Save the project before uploading gallery images.</p>}
                      {(projectDraft.images?.length ?? 0) > 0 ? (
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {projectDraft.images.map((image, index) => (
                            <div
                              key={`${image}-${index}`}
                              draggable={projectDraft.images.length > 1}
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = "move";
                                setDraggedGalleryIndex(index);
                              }}
                              onDragEnd={() => setDraggedGalleryIndex(null)}
                              onDragOver={(event) => {
                                event.preventDefault();
                                if (draggedGalleryIndex !== null) event.dataTransfer.dropEffect = "move";
                              }}
                              onDrop={(event) => {
                                if (event.dataTransfer.files.length > 0) {
                                  event.stopPropagation();
                                  dropGalleryFiles(event);
                                  return;
                                }
                                event.preventDefault();
                                event.stopPropagation();
                                if (draggedGalleryIndex !== null) reorderGalleryImages(draggedGalleryIndex, index);
                                setDraggedGalleryIndex(null);
                              }}
                              className={`group overflow-hidden rounded-md border bg-card ${draggedGalleryIndex === index ? "border-primary opacity-50" : "border-border"}`}
                            >
                              <div className="relative aspect-video bg-secondary">
                                <img src={image} alt={`Gallery image ${index + 1}`} className="h-full w-full object-cover" />
                                {index === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">First</span>}
                              </div>
                              <div className="flex items-center justify-between gap-1 p-1.5">
                                <span className="truncate text-[10px] text-muted-foreground">Image {index + 1}</span>
                                <div className="flex shrink-0 items-center">
                                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => reorderGalleryImages(index, index - 1)} disabled={busy || index === 0} aria-label={`Move image ${index + 1} earlier`} title="Move earlier">
                                    <ArrowUp size={14} />
                                  </Button>
                                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => reorderGalleryImages(index, index + 1)} disabled={busy || index === projectDraft.images.length - 1} aria-label={`Move image ${index + 1} later`} title="Move later">
                                    <ArrowDown size={14} />
                                  </Button>
                                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeGalleryImage(index)} disabled={busy} aria-label={`Remove image ${index + 1}`} title="Remove image">
                                    <Trash2 size={13} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 rounded-md bg-background/60 px-3 py-5 text-center text-xs text-muted-foreground">No gallery images yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Project
                </Button>
                {selectedProjectSlug !== "new" && (
                  <Button type="button" variant="destructive" onClick={removeProject} disabled={busy}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </section>
            </form>

            <aside className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold text-foreground">Public Preview</h2>
              <FieldHint>How the project card will feel in the portfolio.</FieldHint>
              <div className="mt-4 overflow-hidden rounded-lg border border-primary/20 bg-[#111827]">
                <div className="aspect-video bg-secondary">
                  {projectDraft.image_url || projectDraft.images?.[0] ? (
                    <img src={projectDraft.image_url || projectDraft.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image yet</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-yellow-400">{"*".repeat(Math.max(0, Number(projectDraft.stars) || 0))}</p>
                  <h3 className="mt-2 font-bold text-primary">{projectDraft.title || "Project title"}</h3>
                  <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-muted-foreground">{projectDraft.description || "Project description preview will appear here."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {textToList(techText).slice(0, 5).map((tech) => (
                      <span key={tech} className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-mono-data text-primary">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a href={projectDraft.github_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary px-3 py-2 text-xs text-foreground">
                      <Github size={13} />
                      Code
                    </a>
                    <a href={projectDraft.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground">
                      Demo
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {section === "articles" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="h-fit rounded-lg border border-border bg-card p-3">
              <Button type="button" className="w-full" onClick={() => setSelectedArticleSlug("new")}>
                <Plus size={16} />
                New Article
              </Button>
              <div className="mt-4 space-y-2">
                {articles.map((article) => (
                  <button key={article.slug} type="button" onClick={() => setSelectedArticleSlug(article.slug)} className={`w-full rounded-md border px-3 py-3 text-left text-sm transition-colors ${selectedArticleSlug === article.slug ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                    <span className="block font-medium">{article.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{article.slug}</span>
                    <span className="mt-2 block text-xs text-muted-foreground">{article.published ? "Published" : "Draft"} / {article.category}</span>
                  </button>
                ))}
              </div>
            </aside>

            <form onSubmit={saveArticle} className="space-y-5">
              <section className="rounded-lg border border-border bg-card p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Article Editor</h2>
                    <FieldHint>Create technical articles for the portfolio blog.</FieldHint>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={articleDraft.published} onChange={(event) => setArticleField("published", event.target.checked)} />
                    Published
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Slug</span>
                    <Input value={articleDraft.slug} onChange={(event) => setArticleField("slug", event.target.value)} disabled={selectedArticleSlug !== "new"} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Title</span>
                    <Input value={articleDraft.title} onChange={(event) => setArticleField("title", event.target.value)} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Category</span>
                    <Input value={articleDraft.category} onChange={(event) => setArticleField("category", event.target.value)} />
                  </label>
                  <div className="space-y-2 text-sm">
                    <span>Cover image</span>
                    <div className="flex gap-2">
                      <Input value={articleDraft.cover_image_url ?? ""} onChange={(event) => setArticleField("cover_image_url", event.target.value)} placeholder="Paste image URL or upload a file" />
                      <input ref={articleCoverInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadArticleCover} className="hidden" />
                      <Button type="button" variant="secondary" onClick={() => articleCoverInputRef.current?.click()} disabled={busy || selectedArticleSlug === "new"}>
                        {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                        Upload
                      </Button>
                    </div>
                    {selectedArticleSlug === "new" && <FieldHint>Save the article once before uploading a cover image.</FieldHint>}
                    {articleDraft.cover_image_url && (
                      <div className="overflow-hidden rounded-md border border-primary/20 bg-secondary">
                        <img src={articleDraft.cover_image_url} alt="" className="aspect-video w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <label className="mt-4 block space-y-2 text-sm">
                  <span>Excerpt</span>
                  <Textarea value={articleDraft.excerpt ?? ""} onChange={(event) => setArticleField("excerpt", event.target.value)} rows={3} />
                </label>
                <label className="mt-4 block space-y-2 text-sm">
                  <span>Content</span>
                  <Textarea value={articleDraft.content ?? ""} onChange={(event) => setArticleField("content", event.target.value)} rows={18} />
                </label>
              </section>
              <section className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Article
                </Button>
                {selectedArticleSlug !== "new" && (
                  <>
                    <Button type="button" variant="secondary" asChild>
                      <Link href={`/articles/${selectedArticleSlug}`}>
                        <ExternalLink size={16} />
                        View
                      </Link>
                    </Button>
                    <Button type="button" variant="destructive" onClick={removeArticle} disabled={busy}>
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </>
                )}
              </section>
            </form>
          </div>
        )}

        {section === "certifications" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="h-fit rounded-lg border border-border bg-card p-3">
              <Button type="button" className="w-full" onClick={() => setSelectedCertificationId("new")}>
                <Plus size={16} />
                New Credential
              </Button>
              <div className="mt-4 space-y-2">
                {certifications.map((credential) => (
                  <button
                    key={credential.id}
                    type="button"
                    onClick={() => setSelectedCertificationId(credential.id ?? "new")}
                    className={`w-full rounded-md border px-3 py-3 text-left text-sm transition-colors ${selectedCertificationId === credential.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 hover:bg-secondary"}`}
                  >
                    <span className="block font-medium">{credential.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{credential.issuer}</span>
                    <span className="mt-2 block text-xs text-muted-foreground">{credential.category === "course" ? "Course" : "Certification"} / {credential.published ? "Published" : "Draft"}</span>
                  </button>
                ))}
              </div>
            </aside>

            <form onSubmit={saveCertification} className="space-y-5">
              <section className="rounded-lg border border-border bg-card p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Credential Editor</h2>
                    <FieldHint>Keep formal certifications separate from courses and training.</FieldHint>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={certificationDraft.published} onChange={(event) => setCertificationField("published", event.target.checked)} />
                    Published
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Type</span>
                    <select
                      value={certificationDraft.category}
                      onChange={(event) => setCertificationField("category", event.target.value as CertificationPayload["category"])}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="certification">Certification</option>
                      <option value="course">Training / Course</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Title</span>
                    <Input value={certificationDraft.title} onChange={(event) => setCertificationField("title", event.target.value)} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Issuer</span>
                    <Input value={certificationDraft.issuer} onChange={(event) => setCertificationField("issuer", event.target.value)} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Issue date</span>
                    <Input type="date" value={certificationDraft.issue_date ?? ""} onChange={(event) => setCertificationField("issue_date", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Credential ID</span>
                    <Input value={certificationDraft.credential_id ?? ""} onChange={(event) => setCertificationField("credential_id", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Verification URL</span>
                    <Input type="url" value={certificationDraft.credential_url ?? ""} onChange={(event) => setCertificationField("credential_url", event.target.value)} placeholder="https://" />
                  </label>
                </div>

                <label className="mt-4 block space-y-2 text-sm">
                  <span>Description</span>
                  <Textarea value={certificationDraft.description ?? ""} onChange={(event) => setCertificationField("description", event.target.value)} rows={3} />
                </label>

                <div className="mt-4 space-y-2 text-sm">
                  <span>Certificate image or PDF</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <input ref={certificationFileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={uploadCertificationDocument} className="hidden" />
                    <Button type="button" variant="secondary" onClick={() => certificationFileInputRef.current?.click()} disabled={busy || selectedCertificationId === "new"}>
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload size={16} />}
                      Upload certificate
                    </Button>
                    <FieldHint>JPG, PNG, WebP, or PDF. Up to 10 MB.</FieldHint>
                  </div>
                  {certificationDraft.file_url && (
                    <a href={certificationDraft.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-primary hover:underline">
                      <ExternalLink size={14} />
                      Open uploaded document
                    </a>
                  )}
                  {selectedCertificationId === "new" && <FieldHint>Save the credential first, then upload its document.</FieldHint>}
                </div>
              </section>

              <section className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Credential
                </Button>
                {selectedCertificationId !== "new" && (
                  <Button type="button" variant="destructive" onClick={removeCertification} disabled={busy}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </section>
            </form>
          </div>
        )}

        {section === "testimonials" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="h-fit rounded-lg border border-border bg-card p-3">
              <Button type="button" className="w-full" onClick={() => setSelectedTestimonialId("new")}>
                <Plus size={16} />
                New Testimonial
              </Button>
              <div className="mt-4 space-y-2">
                {testimonials.map((testimonial) => (
                  <button key={testimonial.id} type="button" onClick={() => setSelectedTestimonialId(testimonial.id ?? "new")} className={`w-full rounded-md border px-3 py-3 text-left text-sm transition-colors ${selectedTestimonialId === testimonial.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 hover:bg-secondary"}`}>
                    <span className="block font-medium">{testimonial.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{testimonial.role || "No role added"}</span>
                    <span className="mt-2 block text-xs text-muted-foreground">{testimonial.approved ? "Visible" : "Hidden"} / {testimonial.rating} stars</span>
                  </button>
                ))}
              </div>
            </aside>

            <form onSubmit={saveTestimonial} className="space-y-5">
              <section className="rounded-lg border border-border bg-card p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Testimonial Editor</h2>
                    <FieldHint>Publish client reviews and portfolio testimonials.</FieldHint>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={testimonialDraft.approved} onChange={(event) => setTestimonialField("approved", event.target.checked)} />
                    Visible
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span>Name</span>
                    <Input value={testimonialDraft.name} onChange={(event) => setTestimonialField("name", event.target.value)} required />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Role / Company</span>
                    <Input value={testimonialDraft.role ?? ""} onChange={(event) => setTestimonialField("role", event.target.value)} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Rating</span>
                    <Input type="number" min={0} max={5} value={testimonialDraft.rating} onChange={(event) => setTestimonialField("rating", Number(event.target.value))} />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span>Display order</span>
                    <Input type="number" value={testimonialDraft.display_order} onChange={(event) => setTestimonialField("display_order", Number(event.target.value))} />
                  </label>
                </div>

                <label className="mt-4 block space-y-2 text-sm">
                  <span>Review</span>
                  <Textarea value={testimonialDraft.quote} onChange={(event) => setTestimonialField("quote", event.target.value)} rows={7} required />
                </label>
              </section>

              <section className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Testimonial
                </Button>
                {selectedTestimonialId !== "new" && (
                  <Button type="button" variant="destructive" onClick={removeTestimonial} disabled={busy}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </section>
            </form>
          </div>
        )}

        {section === "comments" && (
          <section className="mt-6 rounded-lg border border-border bg-card p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Comment Moderation</h2>
                <FieldHint>New public comments stay hidden until approved.</FieldHint>
              </div>
              <Button type="button" variant="secondary" onClick={loadComments} disabled={busy}>
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
            <div className="space-y-3">
              {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-medium">{comment.author_name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{comment.article_slug} / {comment.approved ? "Approved" : "Pending"}</p>
                      {comment.author_email && <p className="mt-1 text-xs text-muted-foreground">{comment.author_email}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={() => moderateComment(comment.id, true)} disabled={busy || comment.approved}>
                        <CheckCircle2 size={14} />
                        Approve
                      </Button>
                      <Button type="button" size="sm" variant="secondary" onClick={() => moderateComment(comment.id, false)} disabled={busy || !comment.approved}>
                        <XCircle size={14} />
                        Hide
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => removeComment(comment.id)} disabled={busy}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{comment.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
