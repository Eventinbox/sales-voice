"use client";
import { mockDebts } from "@/lib/mock-data";
import Button from "@/components/Button";
import ListRow from "@/components/ListRow";
import PriceRangeBar from "@/components/PriceRangeBar";
import StatusPill from "@/components/StatusPill";
import { useRouter } from "next/navigation";

export default function DebtDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const debt = mockDebts.find(d => d.id === params.id) || mockDebts[0];
  const isPaid = debt.status === 'PAID';

  return (
    <div className="px-5 py-6 space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-headline-lg font-bold">{debt.personName}'s Debt</h1>
          <div className="w-8 h-8 rounded-full bg-surface-container" />
        </div>
      </header>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-market p-6 text-center">
        <span className="text-label-lg text-secondary uppercase">Total Amount Due</span>
        <div className="text-big-number text-secondary font-extrabold my-2">
          ₦{debt.amount.toLocaleString()}
        </div>
        <div className="flex items-center justify-center gap-2 text-on-surface-variant text-xs">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Recorded {debt.date}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-label-lg uppercase text-on-surface-variant">Entry Details</h2>
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-market p-4 space-y-4">
          <ListRow
            icon={<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45a.5.5 0 00.55.65h11.5a.5.5 0 00.55-.65l-1.35-2.45 3.6-7.59H21V2H1z" /></svg>}
            label="Item"
            value={debt.item}
            bgColor="bg-primary/10"
            iconColor="text-primary"
          />
          <ListRow
            icon={<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>}
            label="Note"
            value={debt.note || "No additional notes"}
            bgColor="bg-secondary/10"
            iconColor="text-secondary"
          />
          <div className="h-[64px] flex items-center justify-between px-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isPaid ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
              }`}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11.5v6l4.25 2.5c.41.25.5.7.25 1.1h-2.5c-.25.41-.7.5-1.1-.25L12 12.5v-6z" /></svg>
              </div>
              <span className="text-body-md text-on-surface-variant">Status</span>
              <span className={`font-bold ml-2 ${isPaid ? 'text-primary' : 'text-error'}`}>
                {debt.status}
              </span>
            </div>
            <button className="p-2 text-outline-variant">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-label-lg uppercase text-on-surface-variant">Benchmarking</h2>
          <StatusPill label="Good Margin" variant="outline" color="primary" />
        </div>
        <PriceRangeBar current={45000} min={40000} max={50000} />
      </section>

      <div className="fixed bottom-24 left-5 right-5 space-y-3">
        <Button label="✓ Paid in Full" />
        <Button label="Add Payment" variant="outline" />
      </div>
    </div>
  );
}