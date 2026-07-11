interface PriceRangeBarProps {
  current: number;
  min: number;
  max: number;
}

export default function PriceRangeBar({ current, min, max }: PriceRangeBarProps) {
  const percentage = ((current - min) / (max - min)) * 100;

  return (
    <div className="w-full py-4">
      <div className="relative h-3 bg-surface-container-high rounded-full">
        <div
          className="absolute top-1/2 w-5 h-5 bg-primary border-2 border-white rounded-full shadow-[2px_2px_0_0_#dcd9d9]"
          style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-on-surface-variant font-medium">Low: ₦{min.toLocaleString()}</span>
        <span className="text-xs text-on-surface-variant font-medium">High: ₦{max.toLocaleString()}</span>
      </div>
    </div>
  );
}