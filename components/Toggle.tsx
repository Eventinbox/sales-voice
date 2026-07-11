"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full shrink-0 transition-colors border-2 ${
        checked ? 'bg-primary border-primary' : 'bg-surface-container-high border-outline-variant'
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-[1px_1px_0_0_#dcd9d9] transition-all ${
          checked ? 'left-[26px]' : 'left-1'
        }`}
      />
    </button>
  );
}