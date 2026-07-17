"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { currentUser } from "@/lib/mock-data";
import { Currency } from "@/lib/types";
import Toggle from "@/components/Toggle";

const STORAGE_KEY = "sales-voice-settings";

const currencies: { code: Currency; label: string }[] = [
  { code: 'NGN', label: '₦ Naira' },
  { code: 'USD', label: '$ Dollar' },
  { code: 'GHS', label: '₵ Cedi' },
];

function loadSettings() {
  if (typeof window === "undefined") {
    return { currency: 'NGN' as Currency, notificationsEnabled: true, voiceInputEnabled: true };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch
  }
  return { currency: 'NGN' as Currency, notificationsEnabled: true, voiceInputEnabled: true };
}

export default function SettingsPage() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(true);

  useEffect(() => {
    const saved = loadSettings();
    setCurrency(saved.currency);
    setNotificationsEnabled(saved.notificationsEnabled);
    setVoiceInputEnabled(saved.voiceInputEnabled);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currency, notificationsEnabled, voiceInputEnabled }));
  }, [currency, notificationsEnabled, voiceInputEnabled]);

  return (
    <div className="px-5 py-6 space-y-8 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-headline-lg font-bold">Settings</h1>
      </header>

      {/* Profile */}
      <section className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 flex items-center gap-4">
        <Image
          src={currentUser.avatar}
          alt={currentUser.name}
          width={64}
          height={64}
          className="rounded-full border-2 border-primary"
        />
        <div>
          <p className="text-body-lg font-bold">{currentUser.name}</p>
          <p className="text-body-md text-on-surface-variant">{currentUser.shopName}</p>
        </div>
      </section>

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
    </div>
  );
}