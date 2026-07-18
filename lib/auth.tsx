"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken, setToken, clearToken } from "./token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, password: string, name: string, shopName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On load, if there's a stored token, confirm it's still valid against
  // the backend rather than just trusting that it exists.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        setIsAuthenticated(true);
      })
      .catch(() => {
        clearToken();
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(phone: string, password: string): Promise<boolean> {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return false;
      }
      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch {
      setError("Couldn't reach the server. Is the backend running?");
      return false;
    }
  }

  async function register(
    phone: string,
    password: string,
    name: string,
    shopName: string
  ): Promise<boolean> {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, name, shopName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return false;
      }
      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch {
      setError("Couldn't reach the server. Is the backend running?");
      return false;
    }
  }

  function logout() {
    clearToken();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}