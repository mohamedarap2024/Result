import axios from "axios";

/** Production: same-origin /api (Vercel rewrite → backend). Local: port 5228. */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5228/api";
    }
    return `${window.location.origin}/api`;
  }

  return "http://localhost:5228/api";
}

export const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();

  if (typeof window !== "undefined") {
    const isAdmin = config.url?.includes("/admin/");
    const token = isAdmin
      ? localStorage.getItem("admin_token")
      : localStorage.getItem("student_token") ??
        localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (config.data instanceof FormData) {
    config.headers.delete?.("Content-Type");
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/admin") && !path.includes("/login")) {
          localStorage.removeItem("admin_token");
          window.location.href = "/admin/login";
        }
        if (path.startsWith("/student") && !path.includes("/login")) {
          localStorage.removeItem("student_token");
          localStorage.removeItem("student_profile");
          window.location.href = "/student/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function uploadStudentCsv(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api.post<{ count: number; skipped?: number; message?: string }>(
    "/admin/students/csv",
    fd
  );
}

export interface Student {
  id?: number;
  student_id: string;
  name: string;
  subjects?: Record<string, string>;
  total: number;
  grade: string;
  gpa?: number;
  average?: number;
}
