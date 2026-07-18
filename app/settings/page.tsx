"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Currency } from "@/lib/types";
import Toggle from "@/components/Toggle";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";
import AvatarBadge from "@/components/AvatarBadge";

const STORAGE_PREFIX = "sales-voice-settings";

const currencies: { code: Currency; label: string }[] = [
  { code: "NGN", label: "₦ Naira" },
  { code: "USD", label: "$ Dollar" },
  { code: "GHS", label: "₵ Cedi" },
];

function loadSettings(storageKey: string) {
  if (typeof window === "undefined") {
    return {
      currency: "NGN" as Currency,
      notificationsEnabled: true,
      voiceInputEnabled: true,
    };
  }

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as {
        currency?: Currency;
        notificationsEnabled?: boolean;
        voiceInputEnabled?: boolean;
      };

      return {
        currency: parsed.currency ?? "NGN",
        notificationsEnabled: parsed.notificationsEnabled ?? true,
        voiceInputEnabled: parsed.voiceInputEnabled ?? true,
      };
    } catch {
      // Fall through to defaults if localStorage was corrupted.
    }
  }

  return {
    currency: "NGN" as Currency,
    notificationsEnabled: true,
    voiceInputEnabled: true,
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { profile, isLoading } = useProfile();
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const storageKey = profile ? `${STORAGE_PREFIX}:${profile.id}` : STORAGE_PREFIX;

  useEffect(() => {
    const saved = loadSettings(storageKey);
    setCurrency(saved.currency);
    setNotificationsEnabled(saved.notificationsEnabled);
    setVoiceInputEnabled(saved.voiceInputEnabled);
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ currency, notificationsEnabled, voiceInputEnabled }));
  }, [currency, notificationsEnabled, voiceInputEnabled, hydrated, storageKey]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (isLoading || !profile) {
    return (
      <div className="px-5 py-6 space-y-8 pb-24 md:max-w-2xl md:mx-auto md:px-10 md:py-10 md:pb-10">
        <div className="rounded-market border border-surface-container-high bg-surface-container-lowest p-6 text-center text-on-surface-variant">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-8 pb-24 md:max-w-2xl md:mx-auto md:px-10 md:py-10 md:pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-headline-lg font-bold">Settings</h1>
      </header>

      <Link
        href="/profile"
        className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 flex items-center gap-4 hover:bg-surface-container transition-colors"
      >
        <AvatarBadge
          name={profile.name}
          avatar={profile.avatar}
          className="w-16 h-16 rounded-full border-2 border-primary bg-surface-container"
        />
        <div className="flex-1">
          <p className="text-body-lg font-bold">{profile.name}</p>
          <p className="text-body-md text-on-surface-variant">{profile.shopName}</p>
        </div>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="text-on-surface-variant shrink-0"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <section className="space-y-3">
        <h2 className="text-label-lg uppercase text-on-surface-variant">Currency</h2>
        <div className="flex gap-2">
          {currencies.map((option) => {
            const isActive = currency === option.code;
            return (
              <button
                key={option.code}
                onClick={() => setCurrency(option.code)}
                className={`flex-1 h-[48px] rounded-market text-label-lg font-bold border-2 transition-colors ${
                  isActive
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-transparent text-on-surface-variant border-outline-variant"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-label-lg uppercase text-on-surface-variant">Preferences</h2>
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-market divide-y divide-surface-container-high">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-body-md font-bold">Notifications</p>
              <p className="text-body-md text-on-surface-variant text-sm">
                Get notified about unpaid debts and daily summaries
              </p>
            </div>
            <Toggle
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              label="Toggle notifications"
            />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-body-md font-bold">Voice Input</p>
              <p className="text-body-md text-on-surface-variant text-sm">
                Allow logging sales and debts by voice
              </p>
            </div>
            <Toggle
              checked={voiceInputEnabled}
              onChange={setVoiceInputEnabled}
              label="Toggle voice input"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-label-lg uppercase text-on-surface-variant">Account</h2>
        <button
          onClick={handleLogout}
          className="w-full h-[48px] rounded-market text-label-lg font-bold border-2 border-error text-error transition-colors hover:bg-error/10"
        >
          Log Out
        </button>
      </section>
    </div>
  );
}
