"use client";
import { useState, useEffect } from "react";
import PriceRangeBar from "@/components/PriceRangeBar";
import StatusPill from "@/components/StatusPill";
import { PriceBenchmark } from "@/lib/types";
import { fetchPrices } from "@/lib/api";

function TrendIcon({ trend }: { trend: PriceBenchmark['trend'] }) {
  if (trend === 'up') {
    return (
      <svg width="16" height="16" fill="currentColor" className="text-primary" viewBox="0 0 24 24">
        <path d="M7 14l5-5 5 5H7z" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg width="16" height="16" fill="currentColor" className="text-error" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5H7z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" fill="currentColor" className="text-on-surface-variant" viewBox="0 0 24 24">
      <rect x="6" y="11" width="12" height="2" />
    </svg>
  );
}

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrices()
      .then(setPrices)
      .catch(() => setError("Couldn't reach the backend. Is it running on localhost:4000?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-5 py-6 space-y-6 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-headline-lg font-bold">Market Prices</h1>
      </header>

      <p className="text-body-md text-on-surface-variant">
        Track how your prices compare to the market average for everything you sell.
      </p>

      {loading && <p className="text-on-surface-variant text-body-md">Loading...</p>}
      {error && <p className="text-error text-body-md">{error}</p>}

      <div className="space-y-4">
        {prices.map((price) => (
          <div
            key={price.item}
            className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-body-md font-bold">{price.item}</span>
                <TrendIcon trend={price.trend} />
              </div>
              <StatusPill
                label={`Your Price: ₦${price.currentPrice.toLocaleString()}`}
                variant="solid"
                color="primary"
              />
            </div>
            <PriceRangeBar
              current={price.currentPrice}
              min={price.minMarketPrice}
              max={price.maxMarketPrice}
            />
          </div>
        ))}
      </div>
    </div>
  );
}