/**
 * General-purpose utility functions ported from the monolith.
 */

// ---------------------------------------------------------------------------
// parseRest  (monolith line 1896)
// Converts a rest string like "90s" or "2:30" to total seconds.
// ---------------------------------------------------------------------------

export function parseRest(restString: string | null | undefined): number {
  if (!restString) return 0;
  const str = String(restString);

  // "2:30" format
  const minuteMatch = str.match(/(\d+):(\d+)/);
  if (minuteMatch) {
    return parseInt(minuteMatch[1], 10) * 60 + parseInt(minuteMatch[2], 10);
  }

  // "90s" format
  const secondMatch = str.match(/(\d+)s/);
  if (secondMatch) {
    return parseInt(secondMatch[1], 10);
  }

  // Plain number fallback
  const plain = parseInt(str, 10);
  return isNaN(plain) ? 0 : plain;
}

// ---------------------------------------------------------------------------
// fmtTime  (monolith line 1922)
// Formats total seconds as "M:SS"
// ---------------------------------------------------------------------------

export function fmtTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// BMI utilities  (monolith lines 1416-1418)
// ---------------------------------------------------------------------------

/** Calculate BMI from weight (kg) and height (cm). */
export function bmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  return parseFloat((weightKg / (heightCm / 100) ** 2).toFixed(1));
}

/** Return a human-readable BMI category string. */
export function bmiCategory(bmiValue: number): string {
  if (bmiValue < 18.5) return 'Underweight';
  if (bmiValue < 25) return 'Normal';
  if (bmiValue < 30) return 'Overweight';
  if (bmiValue < 35) return 'Obese I';
  return 'Obese II';
}

/** Return a color hex for a given BMI value. */
export function bmiColor(bmiValue: number): string {
  if (bmiValue < 18.5) return '#60A5FA'; // blue
  if (bmiValue < 25) return '#10B981';   // green
  if (bmiValue < 30) return '#F59E0B';   // amber
  if (bmiValue < 35) return '#F97316';   // orange
  return '#EF4444';                       // red
}

// ---------------------------------------------------------------------------
// generateId
// Generates a unique ID string suitable for entities.
// ---------------------------------------------------------------------------

let idCounter = 0;

export function generateId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}_${idCounter.toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// clamp
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
