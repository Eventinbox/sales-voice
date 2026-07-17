"use client";
import Button from "./Button";

interface ActionBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onRecordSale?: () => void;
  onNewDebt?: () => void;
}

export default function ActionBar({ value, onChange, onSend, onRecordSale, onNewDebt }: ActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-20 max-w-md mx-auto px-5 pb-5 bg-gradient-to-t from-background via-background to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-[56px] bg-surface-container rounded-full px-4 flex items-center gap-3 border border-outline-variant">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            placeholder="Type or tap the mic..."
            className="flex-1 bg-transparent outline-none text-on-surface-variant text-body-md placeholder:text-on-surface-variant"
          />
          <button aria-label="Attach file" type="button" className="ml-auto p-2 text-on-surface-variant">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.172 7l-6.172-6.172a.5.5 0 00-.708 0l-6.172 6.172a.5.5 0 000 .708l6.172 6.172" /></svg>
          </button>
        </div>
        <button
          type="button"
          aria-label="Voice input (not yet implemented)"
          className="w-[56px] h-[56px] bg-primary text-white rounded-full flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#dcd9d9]"
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </button>
      </div>
      <div className="flex gap-2">
        <Button label="Record Sale" variant="outline" size="compact" className="flex-1" onClick={onRecordSale} />
        <Button label="New Debt" variant="secondary" size="compact" className="flex-1" onClick={onNewDebt} />
      </div>
    </div>
  );
}