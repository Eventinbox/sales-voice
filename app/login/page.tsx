"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Button from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = login(phone, password);
    if (success) {
      router.replace("/chat");
    } else {
      setError("Enter a valid phone number and a password of at least 4 characters.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-primary rounded-market flex items-center justify-center text-white font-bold text-headline-lg">SV</div>
          <h1 className="text-headline-lg font-bold text-primary">Sales Voice</h1>
          <p className="text-body-md text-on-surface-variant text-center">
            Log in to manage your shop&apos;s sales, debts, and prices.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-surface-container-high rounded-market p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-label-lg text-on-surface-variant">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080X XXX XXXX"
              className="w-full h-[56px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md placeholder:text-on-surface-variant focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-label-lg text-on-surface-variant">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-[56px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md placeholder:text-on-surface-variant focus:border-primary"
            />
          </div>

          {error && <p className="text-error text-sm font-medium">{error}</p>}

          <Button label="Log In" />
        </form>

        <p className="text-center text-on-surface-variant text-sm mt-6">
          New to Sales Voice? Ask your market association rep to set up your shop.
        </p>
      </div>
    </div>
  );
}
