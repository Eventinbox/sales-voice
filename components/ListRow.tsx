interface ListRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  bgColor?: string;
  iconColor?: string;
}

export default function ListRow({
  icon,
  label,
  value,
  valueColor = "text-on-surface",
  bgColor = "bg-surface-container",
  iconColor = "text-on-surface-variant",
}: ListRowProps) {
  return (
    <div className="h-[64px] flex items-center justify-between px-2 gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${bgColor} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <span className="text-body-md text-on-surface-variant">{label}</span>
      </div>
      <span className={`font-bold text-body-md ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}