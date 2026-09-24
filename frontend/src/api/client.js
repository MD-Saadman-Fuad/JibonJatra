
import axios from "axios";

// Determine API base URL with fallback to local server
const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000/api";
  }
  if (process.env.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE;
  }
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Utility function to get backend URL
export const getBackendUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000";
  }
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  return "http://localhost:5000";
};

// Add request interceptor to include auth token and strip redundant /api prefix
api.interceptors.request.use(
  (config) => {
    // Strip redundant leading /api if baseURL already includes /api
    if (config.url && config.url.startsWith("/api/")) {
      config.url = config.url.substring(4);
    } else if (config.url === "/api") {
      config.url = "";
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const backendUrl = getBackendUrl();

  // Normalize path: replace Windows backslashes with forward slashes
  let normalizedPath = imagePath.replace(/\\/g, "/");

  let finalUrl;

  // Handle different path formats
  if (normalizedPath.startsWith("/uploads/")) {
    finalUrl = `${backendUrl}${normalizedPath}`;
  } else if (normalizedPath.startsWith("uploads/")) {
    finalUrl = `${backendUrl}/${normalizedPath}`;
  } else if (normalizedPath.startsWith("/")) {
    finalUrl = `${backendUrl}${normalizedPath}`;
  } else {
    finalUrl = `${backendUrl}/uploads/${normalizedPath}`;
  }

  return finalUrl;
};

export default api;