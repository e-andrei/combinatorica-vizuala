import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Board } from './Board';
import { Formula } from './Formula';
import { Timeline } from './Timeline';
import { useTimeline } from './useTimeline';
import { enumerate } from './configurations';
import { stirling, type Case } from './math';
const dd: Case = { kind: 'arbitrary', ballsDistinct: true, boxesDistinct: true };
export const demoNames = ['Regula produsului', 'Injectivitatea', 'Surjectivitatea', 'Bijectivitatea', 'Numerele Stirling', 'Stars and Bars', 'Partiții întregi'];
export function demonstrationFor(c: Case) {
  if (c.kind === 'injective') return 1;
  if (c.kind === 'bijective') return 3;
  if (!c.ballsDistinct) return c.boxesDistinct ? 5 : 6;
  if (!c.boxesDistinct) return 4;
  return c.kind === 'surjective' ? 2 : 0;
}
export function Demonstration({ initial = 0 }: { initial?: number }) {
  const [active, setActive] = useState(initial);
  return <section className="demonstration">
    <div className="section-heading"><div><span className="eyebrow">ATELIER DE DEMONSTRAȚII</span><h2>Vezi de unde vine formula.</h2></div>
      <select aria-label="Demonstrație" value={active} onChange={e => setActive(+e.target.value)}>{demoNames.map((d, i) => <option value={i} key={d}>{d}</option>)}</select></div>
    <Demo key={active} id={active}/>
  </section>;
}
function Demo({ id }: { id: number }) {
  const length = [5, 5, 4, 5, 10, 4, 6][id], t = useTimeline(length), s = t.step;
  const [identical, setIdentical] = useState(false), [ferrers, setFerrers] = useState(true);
  const [bars, setBars] = useState([2, 4]);
  useEffect(() => { if (id === 5 && s === 3) setBars([2, 4]); }, [id, s]);
  const [st, setSt] = useState([4, 2]);
  const parts = [[5], [4, 1], [3, 2], [3, 1, 1], [2, 2, 1]];
  const sc = { ...dd, kind: 'surjective' as const, boxesDistinct: false };
  const groups = enumerate(st[0], st[1], sc);
  const assignment = (g: number[][]) => { const a: number[] = []; g.forEach((b, j) => b.forEach(i => a[i] = j)); return a; };
  return <div className="demo-stage">
    {id === 0 && <>
      <div className="demo-note"><span className="step-label">0{s + 1}</span><p>{['Une bilă, două alegeri. Urmărim fiecare posibilitate.', 'Prima alegere creează două ramuri.', 'A doua bilă dublează numărul ramurilor.', 'A treia bilă dublează din nou: opt distribuții.', 'În general, fiecare dintre n bile are r alegeri independente.'][s]}</p></div>
      <svg viewBox="0 0 680 240" className="tree" aria-label="Arbore binar cu opt distribuții">
        {[0, 1, 2, 3].map(depth => Array.from({ length: 2 ** depth }, (_, i) => {
          const x = (i + .5) * 680 / 2 ** depth, y = 25 + depth * 62;
          return <motion.g key={`${depth}-${i}`} animate={{ opacity: depth <= s ? 1 : .12 }}>
            {depth > 0 && <line x1={(Math.floor(i / 2) + .5) * 680 / 2 ** (depth - 1)} y1={y - 62} x2={x} y2={y} stroke={i % 2 ? '#e7c878' : '#66b9ff'}/>}
            <circle cx={x} cy={y} r="10" fill={depth ? i % 2 ? '#e7c878' : '#66b9ff' : '#eee'}/>
            {depth === 3 && <text x={x} y={y + 26} textAnchor="middle" fill="#a7aab5" fontSize="12">{i.toString(2).padStart(3, '0').split('').map(b => +b + 1).join(' · ')}</text>}
          </motion.g>;
        }))}
      </svg><Formula block tex={s < 4 ? `2${'\\times 2'.repeat(Math.max(0, Math.min(2, s - 1)))} = ${2 ** Math.max(1, Math.min(3, s))}` : 'r\\cdot r\\cdots r=r^n\\qquad 2^3=8'}/>
    </>}
    {id === 1 && <>
      <p className="demo-description">{s < 3 ? 'O cutie ocupată se închide pentru următoarele bile. Urmărește cum scade numărul alegerilor.' : s === 3 ? 'Produsul alegerilor este un factorial trunchiat.' : 'Dacă ștergem etichetele bilelor, fiecare mulțime de cutii a fost numărată de 3! ori.'}</p>
      <Board n={3} r={4} c={{ ...dd, ballsDistinct: !identical && s !== 4 }} assignment={[0, 1, 2].map((v, i) => i < s ? v : -1)}/>
      <Formula block tex={s < 3 ? ['4', '4\\cdot 3', '4\\cdot 3\\cdot 2'][s] : identical || s === 4 ? '\\frac{4\\cdot3\\cdot2}{3!}=\\binom{4}{3}=4' : '4\\cdot3\\cdot2=\\frac{4!}{(4-3)!}=24'}/>
      <label><input type="checkbox" checked={identical || s === 4} onChange={e => { setIdentical(e.target.checked); if (s === 4) t.setStep(3); }}/> Bile identice: uităm ordinea, păstrăm cutiile ocupate</label>
    </>}
    {id === 2 && <>
      <p className="demo-description">{['Pornim de la toate cele 3³ = 27 de distribuții a trei bile în trei cutii.', 'Scădem, pentru fiecare cutie, distribuțiile în care ea este goală: 3 · 2³ = 24.', 'Am scăzut de două ori distribuțiile cu două cutii goale. Le adăugăm o dată: C(3,2) · 1³ = 3.', 'Trei cutii goale nu pot primi trei bile. Rămân 27 − 24 + 3 − 0 = 6.'][s]}</p>
      <div className="inclusion-grid">{[[0, 1, 2], [0, 0, 1], [0, 0, 0]].map((a, i) => <div className={i ? 'invalid-example' : 'valid-example'} key={i}><Board compact n={3} r={3} c={dd} assignment={a}/><span>{i === 0 ? 'Validă' : `${i} ${i === 1 ? 'cutie goală' : 'cutii goale'} · ${s === 0 ? 'încă inclusă' : s === 1 ? 'scăzută' : i === 2 ? 'corectată prin adunare' : 'eliminată'}`}</span></div>)}</div>
      <Formula block tex={['3^3=27', '27-\\binom31 2^3=3', '27-24+\\binom32 1^3=6', '\\sum_{k=0}^{r}(-1)^k\\binom rk(r-k)^n=r!S(n,r)'][s]}/>
    </>}
    {id === 3 && <>
      <p className="demo-description">{s < 4 ? 'Trei bile distincte și trei cutii distincte: alegeri succesive 3, 2, 1.' : 'Ștergem etichetele cutiilor. Cele șase bijecții sunt acum aceeași colecție de trei grupe cu câte o bilă.'}</p>
      <div className="permutations">{[[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((a, i) => <motion.div key={i} animate={{ opacity: s === 4 && i > 0 ? .12 : 1, scale: s === 4 && i > 0 ? .85 : 1 }}><Board compact n={3} r={3} c={{ ...dd, boxesDistinct: s < 4 }} assignment={a.map((v, j) => j < s || s === 4 ? v : -1)}/></motion.div>)}</div>
      <Formula block tex={s === 4 ? '3!\\longrightarrow 1' : s < 2 ? '3' : '3\\cdot2\\cdot1=3!=6'}/>
    </>}
    {id === 4 && <>
      <p className="demo-description">{s < 7 ? `Partiția ${Math.min(s + 1, groups.length)} din ${groups.length}: ordinea grupelor nu contează.` : s === 7 ? 'Ultima bilă intră într-una dintre k grupe existente: k alegeri pentru fiecare partiție a celorlalte n−1 bile.' : s === 8 ? 'Sau ultima bilă formează singură o grupă nouă. Celelalte bile formează k−1 grupe.' : 'Cele două situații sunt disjuncte și acoperă toate partițiile.'}</p>
      {s < 7 ? <Board n={st[0]} r={st[1]} c={sc} assignment={assignment(groups[s % groups.length] || [])}/> : s === 7 ? <div className="recurrence-choices"><div><Board n={4} r={2} c={sc} assignment={[0, 1, 0, 0]}/><p>Bila 4 intră în prima grupă.</p></div><div><Board n={4} r={2} c={sc} assignment={[0, 1, 0, 1]}/><p>Bila 4 intră în a doua grupă.</p></div></div> : <Board n={4} r={2} c={sc} assignment={s === 8 ? [0, 0, 0, 1] : [0, 1, 0, 1]}/>}
      <Formula block tex={s < 7 ? `S(${st[0]},${st[1]})=${stirling(st[0], st[1])}` : s === 7 ? 'k\\,S(n-1,k)' : s === 8 ? 'S(n-1,k-1)' : 'S(n,k)=kS(n-1,k)+S(n-1,k-1)'}/>
      <p className="muted">Selectează o valoare din triunghi (n pe rânduri, k de la 1 la n). Pentru toate partițiile folosește selectorul de mai jos.</p>
      <div className="stirling-triangle">{[1, 2, 3, 4, 5].map(n => <div key={n}>{Array.from({ length: n }, (_, j) => <button className={st[0] === n && st[1] === j + 1 ? 'active' : ''} title={`S(${n},${j + 1})`} key={j} onClick={() => { setSt([n, j + 1]); t.setStep(0); t.setPlaying(false); }}>{String(stirling(n, j + 1))}</button>)}</div>)}</div>
      <PartitionPicker n={st[0]} r={st[1]}/>
    </>}
    {id === 5 && <>
      <p className="demo-description">{['Cinci stele reprezintă cinci bile identice; două bare despart trei cutii.', 'Mută barele: fiecare șir de stele și bare descrie o singură distribuție.', 'Alegem două poziții pentru bare din șapte poziții: C(7,2) = 21.', 'Pentru surjectivitate, rezervăm o bilă în fiecare cutie. Distribuim apoi cele două bile rămase: C(4,2) = 6.'][s]}</p>
      <div className="stars" aria-label="Șir de stele și bare">{Array.from({ length: 7 }, (_, i) => {
        const next = [bars[1], i].sort((a, b) => a - b);
        return <button key={i} className={bars.includes(i) ? 'bar' : ''} disabled={bars.includes(i) || s === 3 && (next[0] < 1 || next[1] > 5 || next[1] - next[0] < 2)} aria-label={`Poziția ${i + 1}, ${bars.includes(i) ? 'bară' : 'stea'}`} onClick={() => setBars(next)}>{bars.includes(i) ? '│' : '★'}</button>;
      })}</div>
      <div className="flex gap-5 flex-wrap">{bars.map((b, i) => <label key={i}>Bara {i + 1} <input aria-label={`Poziția barei ${i + 1}`} type="range" min={i ? bars[0] + (s === 3 ? 2 : 1) : s === 3 ? 1 : 0} max={i ? s === 3 ? 5 : 6 : bars[1] - (s === 3 ? 2 : 1)} value={b} onChange={e => setBars(bars.map((v, j) => j === i ? +e.target.value : v))}/></label>)}</div>
      {s === 3 && <p className="muted">Bare numai între stele, niciodată alăturate: fiecare cutie rămâne nevidă. Mută-le pentru a descoperi cele șase posibilități.</p>}
      <Board n={5} r={3} c={{ ...dd, ballsDistinct: false }} assignment={[...Array(bars[0]).fill(0), ...Array(bars[1] - bars[0] - 1).fill(1), ...Array(6 - bars[1]).fill(2)]}/>
      <Formula block tex={s === 3 ? '\\binom{n-1}{r-1}\\quad(n\\ge r)' : '\\binom{n+r-1}{r-1}=\\binom72=21'}/>
    </>}
    {id === 6 && <>
      <p className="demo-description">{s < 5 ? `5 = ${parts[s].join(' + ')}. Cutiile identice fac irelevantă ordinea termenilor.` : 'Exact trei părți: 3+1+1 și 2+2+1. Ștergând câte o bilă din fiecare dintre cele trei cutii obținem 2 și 1+1, partițiile lui 2 în cel mult trei părți.'}</p>
      <button onClick={() => setFerrers(!ferrers)}>{ferrers ? 'Vezi bilele în cutii' : 'Vezi diagrama Ferrers'}</button>
      {ferrers ? <svg viewBox="0 0 600 220" aria-label="Diagramă Ferrers" className="ferrers">{(s < 5 ? parts[s] : [3, 1, 1]).map((p, row) => Array.from({ length: p }, (_, col) => <motion.rect key={`${row}-${col}`} x={200 + col * 37} y={35 + row * 45} width="28" height="28" rx="3" animate={{ fill: s === 5 && col === p - 1 ? '#e7c878' : '#e7e8ed', opacity: s === 5 && col === p - 1 ? .35 : 1 }}/>))}</svg> : <Board n={5} r={3} c={{ ...dd, ballsDistinct: false, boxesDistinct: false }} assignment={(s < 5 ? parts[s] : [3, 1, 1]).flatMap((v, j) => Array(v).fill(j))}/>}
      <Formula block tex={s < 5 ? 'p_{\\le3}(5)=5\\qquad p_3(5)=2' : 'p_r(n)=p_{\\le r}(n-r)\\quad(n\\ge r)'}/>
    </>}
    <Timeline t={t} length={length}/>
  </div>;
}
function PartitionPicker({ n, r }: { n: number; r: number }) {
  const groups = enumerate(n, r, { kind: 'surjective', ballsDistinct: true, boxesDistinct: false });
  const [index, setIndex] = useState(0);
  const i = Math.min(index, groups.length - 1), a: number[] = [];
  groups[i]?.forEach((g, j) => g.forEach(b => a[b] = j));
  return <details><summary>Explorează toate cele {groups.length} partiții</summary><Board n={n} r={r} c={{ kind: 'surjective', ballsDistinct: true, boxesDistinct: false }} assignment={a}/><input type="range" aria-label="Partiția Stirling" min="0" max={groups.length - 1} value={i} onChange={e => setIndex(+e.target.value)}/><p>Partiția {i + 1} / {groups.length}</p></details>;
}
