import { useState, useEffect, useContext, createContext } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  userId: number | null;
  setUserId: (id: string | number | null) => void;
  isAuthenticated: boolean;
  clearAuth: () => void;
  username: string;
  setUsername: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserIdState] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

  const isAuthenticated = !!userId;

  // Initialize userId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      const numericId = parseInt(storedUserId, 10);
      if (!isNaN(numericId)) {
        setUserIdState(numericId);
      }
    }
  }, []);

  const setUserId = (id: string | number | null) => {
    if (id !== null) {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      if (!isNaN(numericId)) {
        localStorage.setItem("user_id", numericId.toString());
        setUserIdState(numericId);
      }
    } else {
      localStorage.removeItem("user_id");
      setUserIdState(null);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("user_id");
    setUserIdState(null);
  };

  const value: AuthContextType = {
    userId,
    setUserId,
    isAuthenticated,
    clearAuth,
    username,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper hook for just getting user ID
export const useUserId = (): number | null => {
  const { userId } = useAuth();
  return userId;
};
