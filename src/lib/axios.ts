import axios from "axios";
import { getAuthToken, removeAuthToken } from "./cookie";
import { sanitizeErrorMessage, logSecurityEvent } from "./errors";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logSecurityEvent('unauthorized_access', { 
        url: error.config?.url,
        method: error.config?.method 
      });
      removeAuthToken();
      window.location.href = "/signin";
    }
    
    // Return sanitized error
    const sanitizedError = new Error(sanitizeErrorMessage(error));
    sanitizedError.name = 'APIError';
    return Promise.reject(sanitizedError);
  }
);

export default axiosInstance;