"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";

const PUBLIC_ROUTES = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname ?? "");

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Sidebar />
      <div className="max-w-md mx-auto pb-20 md:max-w-none md:mx-0 md:pb-0 md:pl-64">
        {children}
      </div>
      <BottomTabBar />
    </>
  );
}
