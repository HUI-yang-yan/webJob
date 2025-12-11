
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginDTO } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<string | null>; // Returns error string or null if success
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount, check if we have a token and user info in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginDTO): Promise<string | null> => {
    try {
      const res = await AuthService.login(data);
      if (res.code === 200) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return null;
      } else {
        return res.msg || 'Login failed';
      }
    } catch (error) {
      return 'Network error occurred';
    }
  };

  const logout = () => {
    AuthService.logout(); // Call API if needed
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.hash = '/login';
  };

  // Helper to check if current user has one of the required roles
  const hasRole = (roles: string[]) => {
    if (!user || !user.role) return false;
    if (roles.includes('*')) return true; // Wildcard
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}>
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
