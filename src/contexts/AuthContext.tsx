import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, getUserProfile } from '@/lib/api/users';
import { getAuthToken, removeAuthToken } from '@/lib/cookie';
import { getSessionId, clearSession, refreshSession } from '@/lib/session';

interface User {
  firstName: string;
  lastName: string;
  role: string[];
  id?: number;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Initialize session for security tracking
      const sessionId = getSessionId();
      
      const token = getAuthToken();
      if (token) {
        setAccessToken(token);
        try {
          // Fetch user profile to sync authentication state
          const userData = await getUserProfile();
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role || [],
            id: userData.id,
            email: userData.email
          });
          refreshSession(); // Refresh session on successful auth
        } catch (error) {
          // Token is invalid, remove it
          removeAuthToken();
          setAccessToken(null);
          setUser(null);
          clearSession();
        }
      }
      setIsLoading(false);
    };

    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleLogout);
    initializeAuth();

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      
      const userData: User = {
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role || []
      };

      setUser(userData);
      setAccessToken(response.accessToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    removeAuthToken();
    clearSession(); // Clear session data on logout
  };

  const hasRole = (role: string): boolean => {
    return user?.role?.includes(role) || false;
  };

  const isAdmin = hasRole('ADMIN');

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
        isAuthenticated,
        hasRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};