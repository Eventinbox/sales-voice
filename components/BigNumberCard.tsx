interface BigNumberCardProps {
  label: string;
  value: string;
  colorClass: string;
  onPrimaryContainerClass: string;
}

export default function BigNumberCard({ label, value, colorClass, onPrimaryContainerClass }: BigNumberCardProps) {
  return (
    <div className={`${colorClass} p-6 rounded-market relative overflow-hidden h-44 flex flex-col justify-center`}>
      <span className={`text-label-lg uppercase tracking-wider ${onPrimaryContainerClass} opacity-90`}>
        {label}
      </span>
      <span className="text-white font-extrabold text-big-number mt-1">
        {value}
      </span>
      {/* Watermark Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-10 text-white">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
      </div>
    </div>
  );
}