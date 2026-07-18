import axios from "axios";

export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
export const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
export const IMAGE_BASE = API_BASE.replace(/\/api$/, "");

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const isAdminPage = window.location.pathname.startsWith("/admin");
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");
  const token = isAdminPage ? adminToken : userToken || adminToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminPage = window.location.pathname.startsWith("/admin");
    const isLoginRequest = error.config?.url?.includes("/admin/login");

    if (error.response?.status === 401 && isAdminPage && !isLoginRequest) {
      localStorage.removeItem("adminToken");
      if (window.location.pathname !== "/admin/login") {
        window.location.replace("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

export const imgUrl = (path) => {
  if (!path) {
    return "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80";
  }

  return path.startsWith("http") ? path : `${IMAGE_BASE}${path}`;
};

export default api;
