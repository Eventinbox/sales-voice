"use client";
import Link from "next/link";
import BigNumberCard from "@/components/BigNumberCard";
import ListRow from "@/components/ListRow";
import PriceRangeBar from "@/components/PriceRangeBar";
import StatusPill from "@/components/StatusPill";
import TrendIcon from "@/components/TrendIcon";
import { mockDebts, mockPrices } from "@/lib/mock-data";

export default function DashboardPage() {
  const customerDebts = mockDebts.filter(d => d.type === 'customer');
  const supplierDebts = mockDebts.filter(d => d.type === 'supplier');
  const price = mockPrices[0];

  return (
    <div className="px-5 py-6 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button aria-label="Open menu" className="p-2"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          <h1 className="text-headline-lg font-bold">My Shop Summary</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant" />
      </header>

      {/* Reconciled with mockMessages: ₦4,000 (garri) + ₦45,000 (rice) = ₦49,000 */}
      <BigNumberCard
        label="Today's Sales"
        value="₦49,000"
        colorClass="bg-primary"
        onPrimaryContainerClass="text-on-primary-container"
      />

      <section className="space-y-4">
        <h2 className="text-label-lg uppercase text-on-surface-variant">Credit & Debt</h2>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 space-y-4">
          <div className="flex items-center gap-2 text-secondary font-bold text-label-lg">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 14l-7 7-7-7" /></svg>
            Who owes me
          </div>
          {customerDebts.map(debt => (
            <Link key={debt.id} href={`/debt/${debt.id}`} className="block -mx-2 px-2 rounded-market hover:bg-surface-container transition-colors">
              <ListRow
                icon={<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45a.5.5 0 00.55.65h11.5a.5.5 0 00.55-.65l-1.35-2.45 3.6-7.59H21V2H1z" /></svg>}
                label={debt.personName}
                value={`₦${debt.amount.toLocaleString()}`}
                valueColor="text-secondary"
                bgColor="bg-secondary-container/20"
                iconColor="text-secondary"
              />
            </Link>
          ))}
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 space-y-4">
          <div className="flex items-center gap-2 text-tertiary font-bold text-label-lg">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 10l7-7 7 7" /></svg>
            Who I owe
          </div>
          {supplierDebts.map(debt => (
            <Link key={debt.id} href={`/debt/${debt.id}`} className="block -mx-2 px-2 rounded-market hover:bg-surface-container transition-colors">
              <ListRow
                icon={<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" /></svg>}
                label={debt.personName}
                value={`₦${debt.amount.toLocaleString()}`}
                valueColor="text-tertiary"
                bgColor="bg-tertiary-container/20"
                iconColor="text-tertiary"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4">
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
          <PriceRangeBar current={price.currentPrice} min={price.minMarketPrice} max={price.maxMarketPrice} />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-24 max-w-md mx-auto pointer-events-none z-40">
        <button aria-label="Voice input" className="pointer-events-auto absolute right-5 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-[2px_2px_0_0_#dcd9d9]">
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </button>
      </div>
    </div>
  );
}