import { SaleData, DebtData, PriceData, MessageType } from "../app/types";

interface ActionCardProps {
  type: MessageType;
  data: SaleData | DebtData | PriceData;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function ActionCard({ type, data }: ActionCardProps) {
  if (type === "sale") {
    const d = data as SaleData;
    return (
      <div className="mt-2 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm">
        <p className="font-semibold text-emerald-800">Sale logged</p>
        <p className="text-stone-700">
          {d.qty} × {d.item} —{" "}
          <span className="font-medium">{formatNaira(d.amount)}</span>
        </p>
      </div>
    );
  }

  if (type === "debt") {
    const d = data as DebtData;
    const label = d.type === "owed" ? "owes you" : "you owe";
    return (
      <div className="mt-2 rounded-lg border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm">
        <p className="font-semibold text-rose-800">Debt logged</p>
        <p className="text-stone-700">
          {d.person} {label}{" "}
          <span className="font-medium">{formatNaira(d.amount)}</span>
        </p>
      </div>
    );
  }

  if (type === "price") {
    const d = data as PriceData;
    return (
      <div className="mt-2 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm">
        <p className="font-semibold text-amber-800">Nearby prices — {d.item}</p>
        <p className="text-stone-700">
          {formatNaira(d.min)} – {formatNaira(d.max)}{" "}
          <span className="text-stone-500">(avg {formatNaira(d.avg)})</span>
        </p>
      </div>
    );
  }

  return null;
}
