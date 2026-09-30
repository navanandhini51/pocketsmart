import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api, authStorage } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateName: (newName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const token = authStorage.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.getMe();
        setUser(user);
      } catch (err) {
        console.warn('Session expired or invalid, clearing token');
        authStorage.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    authStorage.setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user, token } = await api.register(name, email, password);
    authStorage.setToken(token);
    setUser(user);
  };

  const demoLogin = async () => {
    await login('demo@example.com', 'demo12345');
  };

  const logout = () => {
    authStorage.clearToken();
    setUser(null);
  };

  const updateName = async (newName: string) => {
    const { user } = await api.updateProfile(newName);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, updateName }}>
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
