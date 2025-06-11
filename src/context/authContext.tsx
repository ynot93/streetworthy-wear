import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService'; // Make sure this is correctly imported
import { UserData } from '../services/authService'; // Assuming authService returns UserData

interface AuthContextProps {
  isLoggedIn: boolean;
  user: UserData | null;
  checkAuth: () => Promise<void>;
  loginUser: (userData: UserData) => void;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Attempt to get user data from the backend.
      // If the httpOnly cookie is present and valid, this will succeed.
      const userData = await authService.getMe();
      setIsLoggedIn(true);
      setUser(userData);
    } catch (error) {
      // If getMe fails (e.g., no cookie, invalid token), user is not logged in.
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (userData: UserData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await authService.logout(); // Call backend logout to clear cookie
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if backend logout fails, clear client state
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication status on component mount
  }, []);

  const value = {
    isLoggedIn,
    user,
    checkAuth,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="flex justify-center items-center h-screen text-xl font-semibold">Checking authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};