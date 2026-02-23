import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { TabBar } from '../components/layout/TabBar';
import { useAppStore } from '../context/AppContext';
import { phaseColors } from '../utils/colors';
import { Trophy, Flag } from 'lucide-react';

const TABS = [
  { key: 'roadmap', label: 'Roadmap' },
  { key: 'weight', label: 'Weight Tracker' },
];

import { milestones } from '../data/meal-plans';
import { WeightTracker } from '../components/tracking/WeightTracker';

// Map months to phase colors
function getPhaseColorForMonth(month: number): string {
  if (month <= 4) return phaseColors[0]; // Phase 1
  if (month <= 8) return phaseColors[1]; // Phase 2
  if (month <= 14) return phaseColors[2]; // Phase 3
  return phaseColors[3]; // Phase 4
}

function getPhaseLabelForMonth(month: number): string {
  if (month <= 4) return 'Phase 1';
  if (month <= 8) return 'Phase 2';
  if (month <= 14) return 'Phase 3';
  return 'Phase 4';
}

export function MilestonesPage() {
  const activePhase = useAppStore((s) => s.activePhase);
  const color = phaseColors[activePhase] ?? phaseColors[0];

  const [activeTab, setActiveTab] = useState('roadmap');

  return (
    <div className="pb-4">
      <Header
        title="Milestones"
        subtitle="Your transformation roadmap"
        rightAction={
          <Trophy size={20} className="text-text-muted" />
        }
      />

      {/* Sub-tabs */}
      <TabBar
        tabs={TABS}
        active={activeTab}
        onChange={setActiveTab}
        color={`text-[${color}]`}
      />

      <div className="mt-4">
        {activeTab === 'roadmap' && <RoadmapTab />}
        {activeTab === 'weight' && <WeightTrackerTab color={color} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Roadmap Tab
// ---------------------------------------------------------------------------

function RoadmapTab() {
  return (
    <div className="px-4 space-y-4">
      {/* Intro card */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4">
        <div className="flex items-center gap-2 mb-2">
          <Flag size={16} className="text-text-muted" />
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-text-primary">
            24-Month Transformation
          </h3>
        </div>
        <p className="text-sm text-text-secondary">
          Track your journey from foundation to goal physique. Each milestone
          represents a measurable achievement across strength, conditioning,
          and body composition.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border-primary" />

        <div className="space-y-3">
          {milestones.map((ms, idx) => {
            const msColor = getPhaseColorForMonth(ms.month);
            const phaseLabel = getPhaseLabelForMonth(ms.month);
            const isLast = idx === milestones.length - 1;

            return (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Month circle */}
                <div
                  className="shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center text-white font-bold z-10 shadow-lg"
                  style={{ backgroundColor: msColor }}
                >
                  <span className="text-xs leading-none">M</span>
                  <span className="text-sm leading-none">{ms.month}</span>
                </div>

                {/* Card */}
                <div
                  className={[
                    'flex-1 rounded-xl border-l-[3px] bg-bg-secondary border border-border-primary p-3',
                    isLast ? 'ring-2 ring-offset-2 ring-offset-bg-primary' : '',
                  ].join(' ')}
                  style={{
                    borderLeftColor: msColor,
                    ...(isLast ? { ringColor: msColor } : {}),
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {ms.text}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">
                        {phaseLabel} - Month {ms.month}
                      </p>
                    </div>
                    {isLast && (
                      <span className="text-lg">
                        <Trophy size={18} style={{ color: msColor }} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase legend */}
      <div className="bg-bg-secondary rounded-xl border border-border-primary p-4">
        <h4 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">
          Phase Guide
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Phase 1: Foundation', months: 'M1-4', idx: 0 },
            { label: 'Phase 2: Hypertrophy', months: 'M5-8', idx: 1 },
            { label: 'Phase 3: Strength + Cut', months: 'M9-14', idx: 2 },
            { label: 'Phase 4: Recomposition', months: 'M15-24', idx: 3 },
          ].map((p) => (
            <div key={p.idx} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: phaseColors[p.idx] }}
              />
              <div>
                <p className="text-xs text-text-primary font-medium">
                  {p.label}
                </p>
                <p className="text-[10px] text-text-muted">{p.months}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weight Tracker Tab
// ---------------------------------------------------------------------------

function WeightTrackerTab({ color }: { color: string }) {
  return (
    <div className="px-4">
      <WeightTracker phaseColor={color} />
    </div>
  );
}
