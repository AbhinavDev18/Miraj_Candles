import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockAuth } from '../lib/mockAuth';

interface AuthContextType {
  currentUser: User | null;
  user: User | null; // Add user alias for compatibility
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const user = await mockAuth.signIn(email, password);
    setCurrentUser(user);
  };

  const logout = async () => {
    await mockAuth.signOut();
    setCurrentUser(null);
  };

  useEffect(() => {
    // Check for existing user on mount
    const user = mockAuth.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    user: currentUser, // Add user alias for compatibility
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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