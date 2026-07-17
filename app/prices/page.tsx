"use client";
import PriceRangeBar from "@/components/PriceRangeBar";
import StatusPill from "@/components/StatusPill";
import TrendIcon from "@/components/TrendIcon";
import { mockPrices } from "@/lib/mock-data";

export default function PricesPage() {
  return (
    <div className="px-5 py-6 space-y-6 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-headline-lg font-bold">Market Prices</h1>
      </header>

      <p className="text-body-md text-on-surface-variant">
        Track how your prices compare to the market average for everything you sell.
      </p>

      <div className="space-y-4">
        {mockPrices.map((price) => (
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