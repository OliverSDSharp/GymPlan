import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Rest timer hook with Web Audio API beep and vibration on completion.
 *
 * Usage:
 *   const { seconds, isRunning, start, pause, resume, stop } = useTimer();
 *   start(90); // start a 90-second countdown
 */

interface UseTimerReturn {
  /** Current remaining seconds */
  seconds: number;
  /** Whether the timer is actively counting down */
  isRunning: boolean;
  /** Start a new countdown from `duration` seconds */
  start: (duration: number) => void;
  /** Pause the running timer */
  pause: () => void;
  /** Resume a paused timer */
  resume: () => void;
  /** Stop and reset the timer to 0 */
  stop: () => void;
}

// Play a short beep using the Web Audio API (no external files needed)
function playBeep(): void {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);

    // Clean up after sound finishes
    oscillator.onended = () => {
      gain.disconnect();
      oscillator.disconnect();
      ctx.close().catch(() => {});
    };
  } catch {
    // Web Audio not available -- silent fail
  }
}

// Trigger vibration on supported devices (Android PWA)
function vibrate(): void {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  } catch {
    // Vibration API not available -- silent fail
  }
}

export function useTimer(): UseTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onComplete = useCallback(() => {
    playBeep();
    vibrate();
  }, []);

  const tick = useCallback(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        // Timer just hit 0
        clearTimer();
        setIsRunning(false);
        isPausedRef.current = false;
        onComplete();
        return 0;
      }
      return prev - 1;
    });
  }, [clearTimer, onComplete]);

  const startInterval = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(tick, 1000);
  }, [clearTimer, tick]);

  const start = useCallback(
    (duration: number) => {
      clearTimer();
      isPausedRef.current = false;
      setSeconds(duration);
      setIsRunning(true);
      // Need to set up interval after state update; use a micro-delay
      // so that the first tick happens after 1 second
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            isPausedRef.current = false;
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer, onComplete],
  );

  const pause = useCallback(() => {
    clearTimer();
    isPausedRef.current = true;
    setIsRunning(false);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (!isPausedRef.current) return;
    isPausedRef.current = false;
    setIsRunning(true);
    startInterval();
  }, [startInterval]);

  const stop = useCallback(() => {
    clearTimer();
    isPausedRef.current = false;
    setSeconds(0);
    setIsRunning(false);
  }, [clearTimer]);

  return { seconds, isRunning, start, pause, resume, stop };
}
