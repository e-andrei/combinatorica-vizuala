import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'motion/react';
import { Board } from './Board';
import { Formula } from './Formula';
import { count, kinds, names, type Case } from './math';
import { enumerate, ENUMERATION_LIMIT, validate } from './configurations';
import { cases, caseId, combinations, condition, formula, proof, title } from './content';
import { NumberTables } from './NumberTables';

function storedNumber(key: string, fallback: number, max: number) {
  try { const value = localStorage.getItem(key); return value === null ? fallback : Math.max(0, Math.min(max, Math.floor(Number(value)) || 0)); } catch { return fallback; }
}
export default function App() {
  const [page, setPage] = useState(() => location.hash.slice(1));
  useEffect(() => {
    const navigate = () => { setPage(location.hash.slice(1)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  const active = page === 'stirling' || page === 'partitii' ? page : 'plasamente';
  return <>
    <nav className="page-nav" aria-label="Pagini">
      <a href="#plasamente" aria-current={active === 'plasamente' ? 'page' : undefined}>Bile și cutii</a>
      <a href="#stirling" aria-current={active === 'stirling' ? 'page' : undefined}>Stirling · speța a II-a</a>
      <a href="#partitii" aria-current={active === 'partitii' ? 'page' : undefined}>Partiții întregi</a>
    </nav>
    {active === 'plasamente' ? <Placements/> : <NumberTables key={active} kind={active}/>}
  </>;
}
function Placements() {
  const [c, setC] = useState<Case>(cases[0]);
  const [n, setN] = useState(() => storedNumber('sim-n', 5, 8));
  const [r, setR] = useState(() => storedNumber('sim-r', 3, 6));
  useEffect(() => { try { localStorage.setItem('sim-n', String(n)); localStorage.setItem('sim-r', String(r)); } catch { /* Optional persistence. */ } }, [n, r]);
  return <MotionConfig reducedMotion="user"><main>
    <header className="page-heading"><div><p className="overline">BILE ȘI CUTII / COMBINATORICĂ</p><h1>Șaisprezece moduri de a număra.</h1><p>Alege o formulă din tabel. Urmărește cum se așază bilele.</p></div><span className="heading-symbol" aria-hidden="true">∑</span></header>
    <section aria-label="Tabelul celor 16 plasamente">
      <div className="table-toolbar"><span>Același experiment. Patru reguli.</span><div className="parameters">
        <label><i>n</i> <span>bile</span><input aria-label="Numărul bilelor" type="number" min="0" max="8" value={n} onChange={e => setN(Math.max(0, Math.min(8, Math.floor(Number(e.target.value)) || 0)))}/></label>
        <label><i>r</i> <span>cutii</span><input aria-label="Numărul cutiilor" type="number" min="0" max="6" value={r} onChange={e => setR(Math.max(0, Math.min(6, Math.floor(Number(e.target.value)) || 0)))}/></label>
      </div></div>
      <div className="table-scroll" tabIndex={0} aria-label="Tabel de formule, derulabil orizontal pe mobil"><table><caption>Formula generală și numărul de distribuții pentru n = {n}, r = {r}</caption><thead><tr><th scope="col">Bile / cutii</th>{kinds.map(k => <th scope="col" key={k}>{names[k]}<small>{k === 'arbitrary' ? 'fără restricții' : k === 'injective' ? 'cel mult una · n ≤ r' : k === 'surjective' ? 'cel puțin una · n ≥ r' : 'exact una · n = r'}</small></th>)}</tr></thead>
        <tbody>{combinations.map(combo => <tr key={combo.label}><th scope="row"><span>{combo.ballsDistinct ? 'Bile distincte' : 'Bile identice'}</span><small>{combo.boxesDistinct ? 'cutii distincte' : 'cutii identice'}</small></th>{kinds.map(kind => { const value = { ...combo, kind }, selected = caseId(c) === caseId(value); return <td key={kind}><button className="formula-cell" aria-label={title(value)} aria-pressed={selected} onClick={() => setC(value)}><Formula tex={formula(value)}/><span className="cell-value">{String(count(n, r, value))} <span>distribuții</span></span></button></td>; })}</tr>)}</tbody></table></div>
      <p className="table-note">Valorile de sub formule corespund lui n și r de mai sus. În afara condițiilor de existență, numărul este 0.</p>
    </section>
    <Experiment key={`${caseId(c)}-${n}-${r}`} c={c} n={n} r={r}/>
    <footer><p><Formula tex="S(n,r)"/> numără partițiile unei mulțimi în r grupe nevide. <Formula tex="p_r(n)"/> numără partițiile întregi în exact r părți, iar <Formula tex="p_{\le r}(n)"/> în cel mult r părți.</p><p>Pentru n = r = 0 există o singură distribuție: cea vidă. Cu bile și fără cutii nu există niciuna. Cu zero bile și cutii existente sunt posibile doar plasamentele arbitrare și injective. Aceste cazuri se calculează separat, fără factoriale sau binomiale nedefinite.</p></footer>
  </main></MotionConfig>;
}
function Experiment({ c, n, r }: { c: Case; n: number; r: number }) {
  const reduced = useReducedMotion();
  const total = count(n, r, c);
  const configurations = useMemo(() => total <= BigInt(ENUMERATION_LIMIT) ? enumerate(n, r, c) : null, [n, r, c, total]);
  const [index, setIndex] = useState(0), [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState<number[] | null>(null);
  const length = configurations?.length ?? 0;
  useEffect(() => { if (!playing || length < 2) return; const timer = setInterval(() => setIndex(i => (i + 1) % length), 1800); return () => clearInterval(timer); }, [playing, length]);
  const assignment = useMemo(() => {
    if (manual) return manual;
    const a = Array<number>(n).fill(-1);
    if (configurations?.[index]) configurations[index].forEach((g, j) => g.forEach(i => a[i] = j));
    else if (total > 0n && r > 0) for (let i = 0; i < n; i++) a[i] = c.kind === 'arbitrary' ? 0 : Math.min(i, r - 1);
    return a;
  }, [manual, configurations, index, n, r, c.kind, total]);
  const groups = Array.from({ length: r }, (_, j) => assignment.flatMap((v, i) => v === j ? [i] : []));
  const validity = validate(groups, n, c);
  return <section className="experiment" aria-label="Animația cazului selectat">
    <div className="experiment-heading"><div><p className="overline">CAZUL SELECTAT</p><h2>{names[c.kind]} <span>— bile {c.ballsDistinct ? 'distincte' : 'identice'}, cutii {c.boxesDistinct ? 'distincte' : 'identice'}</span></h2></div><span className="total"><b>{String(total)}</b> distribuții</span></div>
    <div className="experiment-body"><div className="animation">
      <Board n={n} r={r} c={c} assignment={assignment} onChange={a => { setPlaying(false); setManual(a); }}/>
      {length > 1 && <div className="playback"><button onClick={() => { setManual(null); setPlaying(!playing); }} aria-label={playing ? 'Oprește animația' : 'Redă animația'}>{playing ? 'Ⅱ Pauză' : '▷ Redă'}</button><input aria-label="Distribuția afișată" type="range" min="0" max={length - 1} value={index} onChange={e => { setManual(null); setPlaying(false); setIndex(+e.target.value); }}/><span>{manual ? 'manual' : `${index + 1} / ${length}`}</span></div>}
      <p className="state" role="status">{total === 0n ? 'Nu există distribuții care respectă această condiție.' : manual ? validity.reason : total === 1n ? 'O singură distribuție posibilă.' : configurations ? 'Fiecare poziție a cursorului este o distribuție distinctă.' : `Un exemplu valid. Pentru a parcurge toate distribuțiile, redu n sau r (limita: ${ENUMERATION_LIMIT}).`}</p>
      {reduced && <p className="motion-note">Mișcarea este redusă conform preferinței dispozitivului.</p>}
    </div><div className="explanation"><Formula block tex={formula(c)}/><p className="rule">{condition(c)}</p><ol>{proof(c).map(line => <li key={line}>{line}</li>)}</ol></div></div>
  </section>;
}
