"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockSettings } from "@/lib/mock-data";
import { Currency } from "@/lib/types";
import Toggle from "@/components/Toggle";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";

const currencies: { code: Currency; label: string }[] = [
  { code: 'NGN', label: '₦ Naira' },
  { code: 'USD', label: '$ Dollar' },
  { code: 'GHS', label: '₵ Cedi' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { profile, isLoading } = useProfile();
  const [currency, setCurrency] = useState<Currency>(mockSettings.currency);
  const [notificationsEnabled, setNotificationsEnabled] = useState(mockSettings.notificationsEnabled);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(mockSettings.voiceInputEnabled);

  function handleLogout() {
    logout();
    router.replace('/login');
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

      {/* Profile */}
      <Link
        href="/profile"
        className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 flex items-center gap-4 hover:bg-surface-container transition-colors"
      >
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-16 h-16 rounded-full border-2 border-primary"
        />
        <div className="flex-1">
          <p className="text-body-lg font-bold">{profile.name}</p>
          <p className="text-body-md text-on-surface-variant">{profile.shopName}</p>
        </div>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-on-surface-variant shrink-0"><path d="M9 5l7 7-7 7" /></svg>
      </Link>

      {/* Currency */}
      <section className="space-y-3">
        <h2 className="text-label-lg uppercase text-on-surface-variant">Currency</h2>
        <div className="flex gap-2">
          {currencies.map((c) => {
            const isActive = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`flex-1 h-[48px] rounded-market text-label-lg font-bold border-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-transparent text-on-surface-variant border-outline-variant'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Preferences */}
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

      {/* Account */}
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
