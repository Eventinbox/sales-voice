interface ButtonProps {
  label: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'default' | 'compact';
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: "bg-primary text-on-primary border-2 border-primary",
  outline: "bg-transparent text-primary border-2 border-primary",
  // Uses on-secondary-container (dark brown) for text, not white — matches
  // DESIGN.md's pairing rule for the secondary-container token.
  secondary: "bg-secondary-container text-on-secondary-container border-2 border-secondary-container",
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  default: "h-[56px]",
  compact: "h-[48px]",
};

export default function Button({
  label,
  variant = 'primary',
  size = 'default',
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-market font-bold text-label-lg transition-transform active:scale-95 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {label}
    </button>
  );
}