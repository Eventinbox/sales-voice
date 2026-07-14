"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "sales-voice-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem(STORAGE_KEY) === "true");
    setIsLoading(false);
  }, []);

  function login(phone: string, password: string) {
    // Mock authentication only — there is no backend yet, so any well-formed
    // phone number + password combo succeeds. Swap this out for a real API
    // call once auth is backed by a server.
    if (phone.trim().length < 7 || password.trim().length < 4) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY, "true");
    setIsAuthenticated(true);
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
