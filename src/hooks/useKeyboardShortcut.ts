import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {},
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const ctrlMatch = modifiers.ctrl ? e.ctrlKey || e.metaKey : true;
      const shiftMatch = modifiers.shift ? e.shiftKey : true;
      if (ctrlMatch && shiftMatch && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}
