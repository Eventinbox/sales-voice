"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Button from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, error } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError("");

    if (phone.trim().length < 7 || password.trim().length < 4) {
      setLocalError("Enter a valid phone number and a password of at least 4 characters.");
      return;
    }
    if (mode === "register" && (!name.trim() || !shopName.trim())) {
      setLocalError("Name and shop name are required.");
      return;
    }

    setSubmitting(true);
    const success =
      mode === "login"
        ? await login(phone, password)
        : await register(phone, password, name, shopName);
    setSubmitting(false);

    if (success) {
      router.replace("/chat");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-primary rounded-market flex items-center justify-center text-white font-bold text-headline-lg">SV</div>
          <h1 className="text-headline-lg font-bold text-primary">Sales Voice</h1>
          <p className="text-body-md text-on-surface-variant text-center">
            {mode === "login"
              ? "Log in to manage your shop's sales, debts, and prices."
              : "Set up your shop to start tracking sales, debts, and prices."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-surface-container-high rounded-market p-6 space-y-5">
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-label-lg text-on-surface-variant">
                  Your Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mama Tolu"
                  className="w-full h-[56px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md placeholder:text-on-surface-variant focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="shopName" className="text-label-lg text-on-surface-variant">
                  Shop Name
                </label>
                <input
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Mama Tolu Provisions"
                  className="w-full h-[56px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md placeholder:text-on-surface-variant focus:border-primary"
                />
              </div>
            </>
          )}

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
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-[56px] bg-surface-container rounded-market px-4 border border-outline-variant outline-none text-on-surface text-body-md placeholder:text-on-surface-variant focus:border-primary"
            />
          </div>

          {(localError || error) && (
            <p className="text-error text-sm font-medium">{localError || error}</p>
          )}

          <Button
            label={submitting ? "Please wait..." : mode === "login" ? "Log In" : "Create Shop Account"}
          />
        </form>

        <p className="text-center text-on-surface-variant text-sm mt-6">
          {mode === "login" ? (
            <>
              New to Sales Voice?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-primary font-bold"
              >
                Set up your shop
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary font-bold"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}