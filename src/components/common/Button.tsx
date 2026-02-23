import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const variantClasses: Record<string, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 border border-transparent',
  secondary:
    'bg-transparent text-text-primary border border-border-secondary hover:bg-bg-tertiary active:bg-bg-tertiary/80',
  ghost:
    'bg-transparent text-text-secondary border border-transparent hover:bg-bg-tertiary hover:text-text-primary active:bg-bg-tertiary/80',
  danger:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 border border-transparent',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      color,
      fullWidth = false,
      icon,
      className = '',
      children,
      disabled,
      ...rest
    },
    ref,
  ) {
    // When a custom color is provided and variant is primary, override bg colors
    const colorOverride =
      color && variant === 'primary'
        ? `${color} text-white border border-transparent`
        : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          sizeClasses[size],
          colorOverride || variantClasses[variant],
          fullWidth ? 'w-full' : '',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  },
);
