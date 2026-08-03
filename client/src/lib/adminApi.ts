export const API_BASE = "https://portofolio-theta-jet-96.vercel.app";
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
