// Error sanitization and handling utilities

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const sanitizeErrorMessage = (error: any): string => {
  // Prevent information disclosure through error messages
  if (error?.response?.status === 401) {
    return 'Authentication failed. Please check your credentials.';
  }
  
  if (error?.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error?.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error?.response?.status >= 500) {
    return 'A server error occurred. Please try again later.';
  }
  
  // For client-side validation errors, show the actual message
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  // For security errors, show generic message
  if (error instanceof SecurityError) {
    return 'A security error occurred. Please try again.';
  }
  
  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

export const logSecurityEvent = (event: string, details: any) => {
  // In production, this would send to a logging service
  console.warn(`Security Event: ${event}`, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details
  });
};