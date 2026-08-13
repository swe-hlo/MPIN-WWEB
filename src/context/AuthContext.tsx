import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '@/lib/api';
import type { AuthTokens, User, UserRole } from '@/types';

interface AuthContextValue {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    departmentId?: string;
    stationId?: string;
  }) => Promise<User>;
  logout: () => void;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me().then((u) => {
      if (u) {
        setUser(u);
        setTokens({ accessToken: localStorage.getItem('mpin:token') ?? '' });
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    setTokens(res.tokens);
    return res.user;
  }, []);

  const register = useCallback(async (input: Parameters<AuthContextValue['register']>[0]) => {
    const res = await authApi.register(input);
    setUser(res.user);
    setTokens(res.tokens);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setTokens(null);
  }, []);

  const value = useMemo(
    () => ({ user, tokens, loading, login, register, logout, setUser }),
    [user, tokens, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
