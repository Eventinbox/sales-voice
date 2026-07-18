import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ProfileProvider } from "@/lib/profile";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Sales Voice — Mama Tolu Provisions",
  description: "Track daily sales, debts, and market prices for your shop.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-on-background min-h-screen relative">
        <AuthProvider>
          <ProfileProvider>
            <AppShell>{children}</AppShell>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
