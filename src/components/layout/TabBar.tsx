interface TabBarProps {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
  color?: string;
}

export function TabBar({ tabs, active, onChange, color }: TabBarProps) {
  return (
    <div className="flex overflow-x-auto no-scrollbar border-b border-border-primary px-4 gap-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={[
              'shrink-0 px-3 pb-2.5 pt-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
              isActive
                ? `${color ?? 'text-phase-1'} border-current`
                : 'text-text-muted border-transparent hover:text-text-secondary',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
