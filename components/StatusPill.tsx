interface StatusPillProps {
  label: string;
  variant?: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
  className?: string;
}

const colorStyles: Record<
  NonNullable<StatusPillProps['color']>,
  { solid: string; outline: string }
> = {
  primary: {
    solid: "bg-primary text-on-primary",
    outline: "bg-transparent text-primary border-2 border-primary",
  },
  secondary: {
    solid: "bg-secondary-container text-on-secondary-container",
    outline: "bg-transparent text-secondary border-2 border-secondary",
  },
  tertiary: {
    solid: "bg-tertiary-container text-on-tertiary-container",
    outline: "bg-transparent text-tertiary border-2 border-tertiary",
  },
  error: {
    solid: "bg-error text-on-error",
    outline: "bg-transparent text-error border-2 border-error",
  },
};

export default function StatusPill({
  label,
  variant = 'solid',
  color = 'primary',
  className = "",
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colorStyles[color][variant]} ${className}`}
    >
      {label}
    </span>
  );
}