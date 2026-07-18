"use client";
import { useState, useEffect } from "react";
import PriceRangeBar from "@/components/PriceRangeBar";
import StatusPill from "@/components/StatusPill";
import TrendIcon from "@/components/TrendIcon";
import { PriceBenchmark } from "@/lib/types";
import { fetchPrices } from "@/lib/api";

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
