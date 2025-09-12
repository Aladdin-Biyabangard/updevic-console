// CSRF Protection utilities

// Generate a random CSRF token
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Get or create CSRF token for the session
export const getCSRFToken = (): string => {
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
  return token;
};

// Validate request origin for CSRF protection
export const validateOrigin = (): boolean => {
  const origin = window.location.origin;
  const allowedOrigins = [
    origin,
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000',
    'https://localhost:5173'
  ];
  
  return allowedOrigins.includes(origin);
};

// Add CSRF headers to requests
export const addCSRFHeaders = (): { [key: string]: string } => {
  if (!validateOrigin()) {
    throw new Error('Invalid request origin');
  }
  
  return {
    'X-CSRF-Token': getCSRFToken(),
    'X-Requested-With': 'XMLHttpRequest'
  };
};