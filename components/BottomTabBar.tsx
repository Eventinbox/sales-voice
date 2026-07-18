"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navTabs } from "@/lib/nav";

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 max-w-md mx-auto h-20 bg-surface-container-lowest border-t border-surface-container-high flex items-center justify-around px-4 z-50">
      {navTabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path d={tab.icon} />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
