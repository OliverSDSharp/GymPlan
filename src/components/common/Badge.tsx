interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

const sizeClasses: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
};

export function Badge({
  children,
  color,
  variant = 'solid',
  size = 'sm',
  style,
}: BadgeProps) {
  const base = 'inline-flex items-center rounded-full font-medium whitespace-nowrap leading-tight';

  if (variant === 'outline') {
    return (
      <span
        className={[
          base,
          sizeClasses[size],
          'border',
          color ?? 'text-text-secondary border-border-secondary',
        ].join(' ')}
        style={style}
      >
        {children}
      </span>
    );
  }

  // Solid variant
  return (
    <span
      className={[
        base,
        sizeClasses[size],
        color ?? 'bg-bg-tertiary text-text-primary',
      ].join(' ')}
      style={style}
    >
      {children}
    </span>
  );
}
