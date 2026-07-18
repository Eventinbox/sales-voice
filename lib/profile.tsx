"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken } from "./token";
import { ShopProfile } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ProfileContextValue {
  profile: ShopProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<Pick<ShopProfile, "name" | "shopName">>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile({
            id: data.id,
            name: data.name,
            shopName: data.shopName,
            avatar: data.avatar ?? null,
            phone: data.phone,
          } as ShopProfile);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function updateProfile(updates: Partial<Pick<ShopProfile, "name" | "shopName">>) {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const data = await res.json();
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
