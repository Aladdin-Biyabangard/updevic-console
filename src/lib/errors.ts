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

// Security event tracking with rate limiting awareness
let securityEventCount = 0;
const SECURITY_EVENT_LIMIT = 10;
const RESET_INTERVAL = 60000; // 1 minute

setInterval(() => {
  securityEventCount = 0;
}, RESET_INTERVAL);

export const logSecurityEvent = (event: string, details: any) => {
  // Rate limiting for security events to prevent spam
  if (securityEventCount >= SECURITY_EVENT_LIMIT) {
    return;
  }
  securityEventCount++;

  const securityEventData = {
    event,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: sessionStorage.getItem('session_id') || 'unknown',
    ...details
  };

  // In production, this would send to a security monitoring service
  console.warn(`Security Event: ${event}`, securityEventData);
  
  // Store critical events in sessionStorage for debugging
  if (['unauthorized_access', 'csrf_token_mismatch', 'invalid_origin'].includes(event)) {
    const criticalEvents = JSON.parse(sessionStorage.getItem('critical_security_events') || '[]');
    criticalEvents.push(securityEventData);
    // Keep only last 5 critical events
    if (criticalEvents.length > 5) {
      criticalEvents.shift();
    }
    sessionStorage.setItem('critical_security_events', JSON.stringify(criticalEvents));
  }
};