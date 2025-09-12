import axios from "axios";
import { getAuthToken, removeAuthToken } from "./cookie";
import { sanitizeErrorMessage, logSecurityEvent } from "./errors";
import { addCSRFHeaders } from "./csrf";

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
    
    // Add CSRF protection for state-changing requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      try {
        const csrfHeaders = addCSRFHeaders();
        Object.assign(config.headers, csrfHeaders);
      } catch (error) {
        logSecurityEvent('csrf_protection_failed', {
          method: config.method,
          url: config.url,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return Promise.reject(new Error('CSRF validation failed'));
      }
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
      // Let AuthContext handle the redirect to prevent open redirect attacks
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    // Return sanitized error
    const sanitizedError = new Error(sanitizeErrorMessage(error));
    sanitizedError.name = 'APIError';
    return Promise.reject(sanitizedError);
  }
);

export default axiosInstance;