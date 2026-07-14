"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { currentUser as defaultProfile } from "./mock-data";
import { ShopProfile } from "./types";

interface ProfileContextValue {
  profile: ShopProfile;
  updateProfile: (updates: Partial<ShopProfile>) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);
const STORAGE_KEY = "sales-voice-profile";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ShopProfile>(defaultProfile);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      setProfile({ ...defaultProfile, ...JSON.parse(stored) });
    } catch {
      // Ignore malformed cache — fall back to the default mock profile.
    }
  }, []);

  function updateProfile(updates: Partial<ShopProfile>) {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
