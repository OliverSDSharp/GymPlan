interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  animate?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color,
  height = 'h-2',
  showLabel = false,
  animate = true,
}: ProgressBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const clamped = Math.min(pct, 100);
  const isOver = pct > 100;

  // Determine bar color: red if over 100%, custom color, or default blue
  const barColor = isOver
    ? 'bg-red-500'
    : color ?? 'bg-blue-500';

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`flex-1 rounded-full bg-bg-tertiary overflow-hidden ${height}`}>
        <div
          className={[
            'h-full rounded-full',
            barColor,
            animate ? 'transition-all duration-500 ease-out' : '',
          ].join(' ')}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span
          className={[
            'shrink-0 font-mono text-xs tabular-nums',
            isOver ? 'text-red-400' : 'text-text-secondary',
          ].join(' ')}
        >
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
