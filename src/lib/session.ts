// Session management utilities for security

// Generate a session ID for tracking
export const generateSessionId = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Initialize a new session
export const initializeSession = (): string => {
  const sessionId = generateSessionId();
  sessionStorage.setItem('session_id', sessionId);
  sessionStorage.setItem('session_start', new Date().toISOString());
  return sessionId;
};

// Get current session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = initializeSession();
  }
  return sessionId;
};

// Clear session data
export const clearSession = (): void => {
  sessionStorage.removeItem('session_id');
  sessionStorage.removeItem('session_start');
  sessionStorage.removeItem('csrf_token');
  sessionStorage.removeItem('critical_security_events');
};

// Check if session is expired (24 hours)
export const isSessionExpired = (): boolean => {
  const sessionStart = sessionStorage.getItem('session_start');
  if (!sessionStart) return true;
  
  const startTime = new Date(sessionStart).getTime();
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  return (now - startTime) > twentyFourHours;
};

// Refresh session timestamp
export const refreshSession = (): void => {
  sessionStorage.setItem('session_start', new Date().toISOString());
};