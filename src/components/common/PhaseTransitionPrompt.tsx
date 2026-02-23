import { ArrowRight, Trophy, Zap, Star, X } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface PhaseTransitionPromptProps {
  currentPhase: number; // 0-3
  phaseColor: string;
  onDismiss: () => void;
  onTransition: (newPhase: number) => void;
}

interface PhaseInfo {
  name: string;
  icon: React.ReactNode;
  goals: string;
  features: string[];
}

const PHASE_INFO: PhaseInfo[] = [
  {
    name: 'Foundation',
    icon: <Star size={20} />,
    goals: 'Build proper form and movement patterns',
    features: ['Guided exercises', 'Form cues', 'Light progressive overload'],
  },
  {
    name: 'Hypertrophy',
    icon: <Zap size={20} />,
    goals: 'Maximize muscle growth with volume training',
    features: ['Higher volume sets', 'Muscle group splits', 'Advanced tracking'],
  },
  {
    name: 'Strength',
    icon: <Zap size={20} />,
    goals: 'Build raw strength with compound lifts',
    features: ['Heavy compound focus', 'PR tracking', 'Periodization'],
  },
  {
    name: 'Peak',
    icon: <Trophy size={20} />,
    goals: 'Reach your peak performance potential',
    features: ['Competition prep', 'Deload programming', 'Advanced analytics'],
  },
];

const MOTIVATIONAL_PROMPTS: string[] = [
  "You've built a solid foundation! Your form is dialed in and your body is ready for more volume.",
  "Great work on the hypertrophy phase! Your muscles are primed for heavier loads now.",
  "Impressive strength gains! You're ready to push for peak performance.",
  "You've conquered every phase! You're operating at peak level.",
];

/**
 * Converts a hex color to an rgba string with the given opacity.
 */
function hexToRgba(hex: string, opacity: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function PhaseTransitionPrompt({
  currentPhase,
  phaseColor,
  onDismiss,
  onTransition,
}: PhaseTransitionPromptProps) {
  const isLastPhase = currentPhase >= 3;
  const currentInfo = PHASE_INFO[currentPhase];
  const nextInfo = !isLastPhase ? PHASE_INFO[currentPhase + 1] : null;

  /* ---- Last phase: congratulations view ---- */
  if (isLastPhase) {
    return (
      <div
        className="relative rounded-xl border border-border-primary overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(phaseColor, 0.15)} 0%, ${hexToRgba(phaseColor, 0.05)} 100%)`,
        }}
      >
        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors z-10"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>

        <div className="p-5 text-center space-y-3">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mx-auto"
            style={{ backgroundColor: hexToRgba(phaseColor, 0.2) }}
          >
            <Trophy size={28} style={{ color: phaseColor }} />
          </div>

          <h3 className="text-lg font-bold text-text-primary">
            Congratulations, Champion!
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            {MOTIVATIONAL_PROMPTS[currentPhase]} You have completed all training
            phases. Keep pushing your limits in Phase 4: Peak!
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={onDismiss}
          >
            Keep Training
          </Button>
        </div>
      </div>
    );
  }

  /* ---- Transition prompt view ---- */
  return (
    <div
      className="relative rounded-xl border border-border-primary overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(phaseColor, 0.15)} 0%, ${hexToRgba(phaseColor, 0.05)} 100%)`,
      }}
    >
      {/* Dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors z-10"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>

      <div className="p-5 space-y-4">
        {/* Motivational header */}
        <div className="flex items-start gap-3 pr-8">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
            style={{ backgroundColor: hexToRgba(phaseColor, 0.2) }}
          >
            {currentInfo.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Ready for the Next Level?
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {MOTIVATIONAL_PROMPTS[currentPhase]}
            </p>
          </div>
        </div>

        {/* Next phase preview */}
        {nextInfo && (
          <div className="bg-bg-primary/50 rounded-lg border border-border-primary p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: phaseColor }}
              >
                Phase {currentPhase + 2}: {nextInfo.name}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {nextInfo.goals}
            </p>
            <ul className="space-y-1">
              {nextInfo.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-xs text-text-muted"
                >
                  <Star
                    size={10}
                    className="shrink-0"
                    style={{ color: phaseColor }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onDismiss}
          >
            Stay in Phase {currentPhase + 1}
          </Button>

          <Button
            variant="primary"
            size="sm"
            color={phaseColor}
            onClick={() => onTransition(currentPhase + 1)}
            icon={<ArrowRight size={14} />}
          >
            Move to Phase {currentPhase + 2}
          </Button>
        </div>
      </div>
    </div>
  );
}
