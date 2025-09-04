import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  isAuthenticated: boolean;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserIdState] = useState<string | null>(null);

  const isAuthenticated = !!userId;

  // Initialize userId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserIdState(storedUserId);
    }
  }, []);

  const setUserId = (id: string | null) => {
    if (id) {
      localStorage.setItem('user_id', id);
      setUserIdState(id);
    } else {
      localStorage.removeItem('user_id');
      setUserIdState(null);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('user_id');
    setUserIdState(null);
  };

  const value: AuthContextType = {
    userId,
    setUserId,
    isAuthenticated,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for just getting user ID
export const useUserId = (): string | null => {
  const { userId } = useAuth();
  return userId;
};