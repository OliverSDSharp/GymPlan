import { useState, useCallback } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Clock,
  Trophy,
  Settings2,
} from 'lucide-react';
import { useAppStore } from '../../context/AppContext';
import { useStorage } from '../../hooks/useStorage';
import { phaseColors } from '../../utils/colors';
import { phases } from '../../data/phases';
import { PhaseTransitionPrompt } from '../common/PhaseTransitionPrompt';

const NAV_ITEMS = [
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/library', label: 'Library', icon: BookOpen },
  { to: '/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/milestones', label: 'Milestones', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings2 },
] as const;

export function Layout() {
  const activePhase = useAppStore((s) => s.activePhase);
  const setActivePhase = useAppStore((s) => s.setActivePhase);
  const color = phaseColors[activePhase] ?? phaseColors[0];
  const location = useLocation();

  const [dismissedPhase, setDismissedPhase] = useStorage<number | null>('phase_prompt_dismissed', null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Hide phase selector on settings page
  const showPhaseSelector = location.pathname !== '/settings';

  // Show transition prompt on demand (e.g. after completing phase milestones)
  const handleDismiss = useCallback(() => {
    setDismissedPhase(activePhase);
    setShowPrompt(false);
  }, [activePhase, setDismissedPhase]);

  const handleTransition = useCallback((newPhase: number) => {
    setActivePhase(newPhase);
    setDismissedPhase(null);
    setShowPrompt(false);
  }, [setActivePhase, setDismissedPhase]);

  return (
    <div className="flex flex-col h-dvh bg-bg-primary">
      {/* Phase transition prompt */}
      {showPrompt && (
        <PhaseTransitionPrompt
          currentPhase={activePhase}
          phaseColor={color}
          onDismiss={handleDismiss}
          onTransition={handleTransition}
        />
      )}

      {/* Global phase selector bar */}
      {showPhaseSelector && (
        <div className="shrink-0 border-b border-border-primary bg-bg-secondary/60 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar">
            {phases.map((p, idx) => {
              const isActive = idx === activePhase;
              const pColor = phaseColors[idx];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePhase(idx)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all shrink-0',
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-bg-tertiary text-text-muted hover:text-text-secondary',
                  ].join(' ')}
                  style={
                    isActive
                      ? { backgroundColor: pColor, boxShadow: `0 2px 8px ${pColor}40` }
                      : undefined
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: isActive ? '#fff' : pColor }}
                  />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Fixed bottom tab bar */}
      <nav className="shrink-0 border-t border-border-primary bg-bg-secondary/80 backdrop-blur-lg safe-bottom">
        <div className="flex items-center justify-around px-1 pt-1.5 pb-1.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors',
                  isActive
                    ? '' // color applied via inline style
                    : 'text-text-muted hover:text-text-secondary',
                ].join(' ')
              }
              style={({ isActive }) =>
                isActive ? { color } : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
