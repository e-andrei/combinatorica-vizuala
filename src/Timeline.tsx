import type { useTimeline } from './useTimeline';
export function Timeline({ t, length }: { t: ReturnType<typeof useTimeline>; length: number }) {
  return <div className="timeline">
    <div className="flex flex-wrap items-center gap-2">
      <button aria-label="Reia demonstrația" onClick={() => { t.setStep(0); t.setPlaying(false); }}>↺</button>
      <button aria-label="Pasul anterior" disabled={!t.step} onClick={() => t.setStep(s => s - 1)}>←</button>
      <button onClick={() => { if (t.step === length - 1) t.setStep(0); t.setPlaying(!t.playing); }}>{t.playing ? 'Pauză' : '▶ Redă'}</button>
      <button aria-label="Pasul următor" disabled={t.step >= length - 1} onClick={() => t.setStep(s => s + 1)}>→</button>
      <label className="ml-auto">Viteză <select value={t.speed} onChange={e => t.setSpeed(+e.target.value)}>{[.5, 1, 1.5, 2].map(v => <option key={v} value={v}>{v}×</option>)}</select></label>
    </div>
    <input aria-label="Pasul animației" type="range" min="0" max={length - 1} value={t.step} onChange={e => { t.setPlaying(false); t.setStep(+e.target.value); }}/>
    <span className="muted">Pasul {t.step + 1} / {length}</span>
  </div>;
}
