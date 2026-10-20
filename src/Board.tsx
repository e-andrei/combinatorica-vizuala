import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Case } from './math';
export const palette = Array<string>(8).fill('#fff');
export function Board({ n, r, c, assignment, onChange, compact = false }: {
  n: number; r: number; c: Case; assignment: number[]; onChange?: (a: number[]) => void; compact?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [selected, select] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const width = Math.max(480, r * 108 + 36), boxWidth = (width - 36) / Math.max(1, r);
  const move = (i: number, target: number) => { const a = [...assignment]; a[i] = target; onChange?.(a); select(null); };
  const drop = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag === null || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = (e.clientX - bounds.left) * width / bounds.width, y = (e.clientY - bounds.top) * 280 / bounds.height;
    move(drag, y >= 105 && x >= 18 && x < width - 18 && r > 0 ? Math.min(r - 1, Math.floor((x - 18) / boxWidth)) : -1);
    setDrag(null); setPointer(null);
  };
  return <div className={`board ${compact ? 'compact' : ''}`}>
    <svg ref={ref} viewBox={`0 0 ${width} 280`} onPointerUp={drop}
      onPointerMove={e => { if (drag !== null && ref.current) { const bounds = ref.current.getBoundingClientRect(); setPointer({ x: (e.clientX - bounds.left) * width / bounds.width, y: (e.clientY - bounds.top) * 280 / bounds.height }); } }}
      onPointerCancel={() => { setDrag(null); setPointer(null); }} aria-label={`${n} bile și ${r} cutii`}>
      <text x="20" y="25" className="svg-caption">BILE {c.ballsDistinct ? 'DISTINCTE' : 'IDENTICE'}</text>
      {r === 0 && <text x={width / 2} y="180" textAnchor="middle" fill="#fff">Nicio cutie disponibilă</text>}
      {Array.from({ length: r }, (_, j) => <g key={j} role={onChange ? 'button' : undefined} tabIndex={onChange ? 0 : undefined}
        aria-label={`Mută bila selectată în cutia ${j + 1}`}
        onClick={() => selected !== null && move(selected, j)}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && selected !== null) { e.preventDefault(); move(selected, j); } }}>
        <rect x={24 + j * boxWidth} y="108" width={boxWidth - 12} height="125" rx="0" fill="#000" />
        <path d={`M ${24 + j * boxWidth} 112 v 121 h ${boxWidth - 12} v -121`} stroke="#fff" fill="none" strokeWidth="1.5"/>
        <text x={18 + (j + .5) * boxWidth} y="258" textAnchor="middle" className="svg-caption">{c.boxesDistinct ? `CUTIA ${j + 1}` : 'CUTIE'}</text>
      </g>)}
      {Array.from({ length: n }, (_, i) => {
        const box = assignment[i] ?? -1, peers = assignment.slice(0, i).filter(b => b === box).length;
        const x = box < 0 ? 38 + peers * 48 : 18 + (box + .5) * boxWidth + (peers % 2 ? 16 : -16);
        const y = box < 0 ? 65 : 211 - Math.floor(peers / 2) * 29;
        return <motion.g key={i} initial={false} animate={drag === i && pointer ? pointer : { x, y }} transition={drag === i && pointer ? { duration: 0 } : { duration: .65, ease: 'easeInOut' }}
          tabIndex={onChange ? 0 : undefined} role={onChange ? 'button' : undefined}
          aria-label={`Bila ${i + 1}, ${box < 0 ? 'pe raft' : `cutia ${box + 1}`}. Enter selectează; apoi selectează o cutie.`}
          style={{ cursor: onChange ? 'grab' : 'default', touchAction: 'none' }}
          onPointerDown={e => { if (onChange) { e.currentTarget.setPointerCapture(e.pointerId); setDrag(i); select(i); } }}
          onClick={() => onChange && select(i)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } if (e.key === 'Delete') move(i, -1); if (/^[1-6]$/.test(e.key) && +e.key <= r) move(i, +e.key - 1); }}>
          <circle r="13" fill="#fff" stroke={selected === i ? '#fff' : 'transparent'} strokeWidth="4"/>
          {c.ballsDistinct && <text textAnchor="middle" dy="4" fontSize="11" fontWeight="700" fill="#000">{i + 1}</text>}
        </motion.g>;
      })}
    </svg>
    {onChange && !compact && <p className="board-hint">Trage o bilă în cutie sau selectează bila, apoi cutia. Tastatură: Enter și Tab; tastele 1–6 mută direct, Delete readuce pe raft.</p>}
  </div>;
}

