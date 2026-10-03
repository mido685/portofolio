import { API_BASE } from "@/lib/apiBase";

export const ADMIN_SECRET_KEY = "stark_admin_secret";

export type ProjectPayload = {
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  stars: number;
  tech: string[];
  problem: string | null;
  solution: string | null;
  enterprise: string[];
  images: string[];
};

export type ArticlePayload = {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CommentPayload = {
  id: number;
  article_slug: string;
  author_name: string;
  author_email: string | null;
  body: string;
  approved: boolean;
  created_at?: string;
};

export type TestimonialPayload = {
  id?: number;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  approved: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export class AdminAuthError extends Error {
  constructor(message = "Invalid admin secret") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export function isAdminAuthError(error: unknown): error is AdminAuthError {
  return error instanceof AdminAuthError;
}

async function request<T>(
  path: string,
  secret: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("X-Admin-Secret", secret);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const fallback = `Request failed (${response.status})`;
    let message = fallback;
    try {
      const data = await response.json();
      message = data.detail || fallback;
    } catch {
      // Keep the HTTP status fallback.
    }
    if (response.status === 401) {
      throw new AdminAuthError(message);
    }

    throw new Error(message);
  }

  return response.json();
}

export async function listProjects(): Promise<ProjectPayload[]> {
  const response = await fetch(`${API_BASE}/api/projects`);
  if (!response.ok) throw new Error("Failed to load projects");
  const data = await response.json();
  return data.projects;
}

export async function listArticles(includeUnpublished = false): Promise<ArticlePayload[]> {
  const query = includeUnpublished ? "?include_unpublished=true" : "";
  const response = await fetch(`${API_BASE}/api/articles${query}`);
  if (!response.ok) throw new Error("Failed to load articles");
  const data = await response.json();
  return data.articles;
}

export async function getArticle(slug: string, includeUnpublished = false): Promise<ArticlePayload> {
  const query = includeUnpublished ? "?include_unpublished=true" : "";
  const response = await fetch(`${API_BASE}/api/articles/${slug}${query}`);
  if (!response.ok) throw new Error("Failed to load article");
  return response.json();
}

export function createArticle(secret: string, article: ArticlePayload) {
  return request<ArticlePayload>("/api/articles", secret, {
    method: "POST",
    body: JSON.stringify(article),
  });
}

export function updateArticle(secret: string, slug: string, article: ArticlePayload) {
  return request<ArticlePayload>(`/api/articles/${slug}`, secret, {
    method: "PUT",
    body: JSON.stringify(article),
  });
}

export function deleteArticle(secret: string, slug: string) {
  return request<{ deleted: ArticlePayload }>(`/api/articles/${slug}`, secret, {
    method: "DELETE",
  });
}

export function uploadArticleCoverImage(secret: string, slug: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  return request<{ imageUrl: string; article: ArticlePayload }>(
    `/api/articles/${slug}/cover`,
    secret,
    {
      method: "POST",
      body: formData,
    }
  );
}

export async function listArticleComments(slug: string): Promise<CommentPayload[]> {
  const response = await fetch(`${API_BASE}/api/articles/${slug}/comments`);
  if (!response.ok) throw new Error("Failed to load comments");
  const data = await response.json();
  return data.comments;
}

export async function submitArticleComment(
  slug: string,
  comment: Pick<CommentPayload, "author_name" | "author_email" | "body">,
): Promise<CommentPayload> {
  const response = await fetch(`${API_BASE}/api/articles/${slug}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!response.ok) throw new Error("Failed to submit comment");
  return response.json();
}

export async function listComments(secret: string): Promise<CommentPayload[]> {
  const data = await request<{ comments: CommentPayload[] }>("/api/comments", secret);
  return data.comments;
}

export async function verifyAdminSecret(secret: string): Promise<void> {
  await request<{ ok: boolean }>("/api/admin/session", secret);
}

export function updateCommentStatus(secret: string, id: number, approved: boolean) {
  return request<CommentPayload>(`/api/comments/${id}`, secret, {
    method: "PUT",
    body: JSON.stringify({ approved }),
  });
}

export function deleteComment(secret: string, id: number) {
  return request<{ deleted: CommentPayload }>(`/api/comments/${id}`, secret, {
    method: "DELETE",
  });
}

export function createProject(secret: string, project: ProjectPayload) {
  return request<ProjectPayload>("/api/projects", secret, {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function updateProject(secret: string, slug: string, project: ProjectPayload) {
  return request<ProjectPayload>(`/api/projects/${slug}`, secret, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export function deleteProject(secret: string, slug: string) {
  return request<{ deleted: ProjectPayload }>(`/api/projects/${slug}`, secret, {
    method: "DELETE",
  });
}

export function uploadProjectImage(secret: string, slug: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  return request<{ imageUrl: string; project: ProjectPayload }>(
    `/api/projects/${slug}/image`,
    secret,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function uploadProjectImages(secret: string, slug: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return request<{ images: string[] }>(`/api/projects/${slug}/images`, secret, {
    method: "POST",
    body: formData,
  });
}

export async function listTestimonials(): Promise<TestimonialPayload[]> {
  const response = await fetch(`${API_BASE}/api/testimonials`);
  if (!response.ok) throw new Error("Failed to load testimonials");
  const data = await response.json();
  return data.testimonials;
}

export async function listAdminTestimonials(secret: string): Promise<TestimonialPayload[]> {
  const data = await request<{ testimonials: TestimonialPayload[] }>("/api/testimonials/admin", secret);
  return data.testimonials;
}

export function createTestimonial(secret: string, testimonial: TestimonialPayload) {
  return request<TestimonialPayload>("/api/testimonials", secret, {
    method: "POST",
    body: JSON.stringify(testimonial),
  });
}

export function updateTestimonial(secret: string, id: number, testimonial: TestimonialPayload) {
  return request<TestimonialPayload>(`/api/testimonials/${id}`, secret, {
    method: "PUT",
    body: JSON.stringify(testimonial),
  });
}

export function deleteTestimonial(secret: string, id: number) {
  return request<{ deleted: TestimonialPayload }>(`/api/testimonials/${id}`, secret, {
    method: "DELETE",
  });
}
