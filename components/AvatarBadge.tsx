"use client";
import Image from "next/image";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SV";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

interface AvatarBadgeProps {
  name: string;
  avatar?: string | null;
  className?: string;
}

export default function AvatarBadge({ name, avatar, className = "" }: AvatarBadgeProps) {
  const baseClassName = `inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`.trim();

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={96}
        height={96}
        className={baseClassName}
      />
    );
  }

  return (
    <div className={`${baseClassName} bg-primary text-on-primary font-bold`}>
      {getInitials(name)}
    </div>
  );
}
