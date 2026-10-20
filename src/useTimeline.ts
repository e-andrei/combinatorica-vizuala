import { useEffect, useState } from 'react';
export function useTimeline(length: number) {
  const [step, setStep] = useState(0), [playing, setPlaying] = useState(false), [speed, setSpeed] = useState(() => {
    try { const value = Number(localStorage.getItem('animation-speed')); return [.5, 1, 1.5, 2].includes(value) ? value : 1; } catch { return 1; }
  });
  useEffect(() => { try { localStorage.setItem('animation-speed', String(speed)); } catch { /* Optional persistence. */ } }, [speed]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setStep(s => { if (s >= length - 1) { setPlaying(false); return s; } return s + 1; }), 1700 / speed);
    return () => clearInterval(timer);
  }, [playing, speed, length]);
  return { step, setStep, playing, setPlaying, speed, setSpeed };
}
