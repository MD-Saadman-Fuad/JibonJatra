
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "https://jibonjatra.onrender.com/api",
});

// Utility function to get backend URL
export const getBackendUrl = () => {
  return process.env.REACT_APP_BACKEND_URL || "https://jibonjatra.onrender.com";
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const backendUrl = getBackendUrl();

  // Normalize path: replace Windows backslashes with forward slashes
  let normalizedPath = imagePath.replace(/\\/g, '/');

  let finalUrl;

  // Handle different path formats
  if (normalizedPath.startsWith('/uploads/')) {
    // Path already has /uploads/ prefix
    finalUrl = `${backendUrl}${normalizedPath}`;
  } else if (normalizedPath.startsWith('uploads/')) {
    // Path has uploads/ prefix without leading slash
    finalUrl = `${backendUrl}/${normalizedPath}`;
  } else if (normalizedPath.startsWith('/')) {
    // Path starts with slash but no uploads folder
    finalUrl = `${backendUrl}${normalizedPath}`;
  } else {
    // Just a filename, add uploads folder
    finalUrl = `${backendUrl}/uploads/${normalizedPath}`;
  }

  return finalUrl;
};

export default api;