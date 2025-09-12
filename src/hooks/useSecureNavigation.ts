import { useNavigate, NavigateOptions } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logSecurityEvent } from '@/lib/errors';

// Secure navigation hook that prevents open redirect attacks
export const useSecureNavigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // List of allowed routes for redirection
  const allowedRoutes = [
    '/',
    '/signin',
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/applications',
    '/admin/certificates'
  ];

  const secureNavigate = (to: string, options?: NavigateOptions) => {
    // Validate the route to prevent open redirect attacks
    if (!allowedRoutes.includes(to) && !to.startsWith('/admin/')) {
      logSecurityEvent('invalid_redirect_attempt', { 
        attemptedRoute: to,
        currentRoute: window.location.pathname 
      });
      // Redirect to home instead of invalid route
      navigate('/', { replace: true });
      return;
    }

    navigate(to, options);
  };

  const secureLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return {
    secureNavigate,
    secureLogout,
    navigate: secureNavigate // Override default navigate
  };
};