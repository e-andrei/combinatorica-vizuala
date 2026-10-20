const labels = ['Produs', 'Permutări', 'Aranjamente', 'Combinări', 'Stele și bare', 'Stirling', 'Bell', 'Partiții întregi', 'Incl.–excl.', 'Injecții', 'Surjecții', 'Bijecții'];
const edges = [[0, 1], [0, 2], [0, 8], [1, 2], [1, 11], [2, 3], [2, 9], [3, 4], [4, 7], [5, 6], [5, 10], [5, 8], [8, 10], [9, 11], [10, 11]];
export function ConceptGraph({ selected, onSelect }: { selected: number; onSelect: (n: number) => void }) {
  const pos = labels.map((_, i) => ({ x: 100 + i % 4 * 220, y: 40 + Math.floor(i / 4) * 115 }));
  return <div className="concept-graph"><svg viewBox="0 0 860 310" aria-label="Rețeaua relațiilor dintre conceptele combinatorice">
    {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} stroke={a === selected || b === selected ? '#78baff' : '#303541'} strokeWidth={a === selected || b === selected ? 2 : 1}/>)}
    {labels.map((label, i) => <g key={label} role="button" tabIndex={0} aria-label={`Concept: ${label}`} onClick={() => onSelect(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(i); } }} style={{ cursor: 'pointer' }}>
      <rect x={pos[i].x - 80} y={pos[i].y - 23} width="160" height="46" rx="6" fill={i === selected ? '#1c324b' : '#12151e'} stroke={i === selected ? '#78baff' : '#434b5c'}/>
      <text x={pos[i].x} y={pos[i].y + 5} textAnchor="middle" fill={i === selected ? '#a9d5ff' : '#b4bdce'} fontSize="14">{label}</text>
    </g>)}
  </svg><p className="muted">Selectează un nod. Liniile evidențiază legături între metode; explicația și cazurile asociate apar mai jos.</p></div>;
}
