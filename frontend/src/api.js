import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

// Global Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isCheckAuth = error.config?.url?.includes("auth/me");
    if (isCheckAuth) return Promise.resolve({ data: null });

    const message = error.response?.data?.message || "An unexpected error occurred system-wide.";
    
    // Only redirect if unauthorized and NOT already on auth pages
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        toast.error("Session expired. Please login again.");
        window.location.href = "/";
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Global Success Handler for specific methods
api.interceptors.request.use((config) => {
  // You can add logic here if needed, e.g., showing a global loader
  return config;
});

export default api;
