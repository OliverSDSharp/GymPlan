interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  phaseColor?: string;
}

export function Header({ title, subtitle, rightAction, phaseColor }: HeaderProps) {
  return (
    <header className="flex items-start justify-between px-4 pt-6 pb-3">
      <div className="flex-1 min-w-0">
        <h1
          className={[
            'font-heading font-black text-2xl uppercase tracking-wide leading-tight truncate',
            phaseColor ? phaseColor : 'text-text-primary',
          ].join(' ')}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-text-secondary truncate">
            {subtitle}
          </p>
        )}
      </div>
      {rightAction && (
        <div className="shrink-0 ml-3">{rightAction}</div>
      )}
    </header>
  );
}
