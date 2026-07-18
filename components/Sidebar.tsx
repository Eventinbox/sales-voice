"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navTabs } from "@/lib/nav";
import { useProfile } from "@/lib/profile";
import AvatarBadge from "@/components/AvatarBadge";

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col md:border-r md:border-surface-container-high md:bg-surface-container-lowest md:z-50" />
    );
  }

  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col md:border-r md:border-surface-container-high md:bg-surface-container-lowest md:z-50">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 bg-primary rounded-market flex items-center justify-center text-white font-bold shrink-0">SV</div>
        <span className="text-body-lg font-bold text-primary">Sales Voice</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-market font-bold text-label-lg transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0">
                <path d={tab.icon} />
              </svg>
              {tab.name}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/profile"
        className="flex items-center gap-3 px-6 py-5 border-t border-surface-container-high hover:bg-surface-container transition-colors"
      >
        <AvatarBadge
          name={profile.name}
          avatar={profile.avatar}
          className="w-9 h-9 rounded-full border-2 border-primary bg-surface-container"
        />
        <div className="min-w-0">
          <p className="text-body-md font-bold truncate">{profile.name}</p>
          <p className="text-xs text-on-surface-variant truncate">{profile.shopName}</p>
        </div>
      </Link>
    </aside>
  );
}
