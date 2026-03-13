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
    const message = error.response?.data?.message || "An unexpected error occurred system-wide.";
    toast.error(message);

    // Redirect if unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/";
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
