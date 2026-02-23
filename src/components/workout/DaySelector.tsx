import { useRef, useEffect } from 'react';
import { tagColors } from '../../utils/colors';

interface Day {
  day: string;
  label: string;
  tag: string;
}

interface DaySelectorProps {
  days: Day[];
  activeDay: number;
  onChange: (idx: number) => void;
  phaseColor?: string;
}

export function DaySelector({
  days,
  activeDay,
  onChange,
  phaseColor = '#3B82F6',
}: DaySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active day into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeDay]);

  return (
    <div className="relative">
      {/* Scroll fade indicators */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-bg-primary to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-bg-primary to-transparent z-10" />

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1"
      >
        {days.map((d, idx) => {
          const isActive = idx === activeDay;
          const tagColor = tagColors[d.tag] ?? phaseColor;

          return (
            <button
              key={idx}
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => onChange(idx)}
              className={[
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg shrink-0 transition-all min-w-[76px] max-w-[110px]',
                isActive
                  ? 'text-text-primary border-b-2'
                  : 'bg-bg-tertiary text-text-muted hover:text-text-secondary',
              ].join(' ')}
              style={
                isActive
                  ? {
                      backgroundColor: `${phaseColor}18`,
                      borderBottomColor: phaseColor,
                    }
                  : undefined
              }
            >
              {/* Day abbreviation */}
              <span className="text-xs font-medium uppercase tracking-wide">
                {d.day}
              </span>

              {/* Label */}
              <span
                className={[
                  'text-[10px] font-semibold leading-tight text-center line-clamp-2',
                  isActive ? 'text-text-primary' : 'text-text-muted',
                ].join(' ')}
              >
                {d.label}
              </span>

              {/* Tag badge */}
              <span
                className="mt-0.5 px-1.5 py-px rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: tagColor }}
              >
                {d.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
