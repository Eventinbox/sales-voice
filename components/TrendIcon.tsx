import { PriceBenchmark } from "@/lib/types";

export default function TrendIcon({ trend }: { trend: PriceBenchmark['trend'] }) {
  if (trend === 'up') {
    return (
      <svg width="16" height="16" fill="currentColor" className="text-primary" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 14l5-5 5 5H7z" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg width="16" height="16" fill="currentColor" className="text-error" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" fill="currentColor" className="text-on-surface-variant" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="11" width="12" height="2" />
    </svg>
  );
}
