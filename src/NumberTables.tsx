import { useState } from 'react';
import { Formula } from './Formula';
import { bell, partitionsAtMost, partitionsExact, stirling } from './math';

export function NumberTables({ kind }: { kind: 'stirling' | 'partitii' }) {
  const [limit, setLimit] = useState(10);
  const [mode, setMode] = useState<'exact' | 'atMost'>('exact');
  const isStirling = kind === 'stirling';
  const indices = Array.from({ length: limit + 1 }, (_, i) => i);
  const value = isStirling ? stirling : mode === 'exact' ? partitionsExact : partitionsAtMost;
  const notation = isStirling ? 'S(n,k)' : mode === 'exact' ? 'p_k(n)' : 'p_{\\le k}(n)';
  return <main className="number-page">
    <header className="page-heading">
      <div><p className="overline">TABELE COMBINATORICE</p>
        <h1>{isStirling ? 'Numerele Stirling de speța a II-a.' : 'Partiții de numere întregi.'}</h1>
        <p>{isStirling
          ? 'În câte moduri se împart n elemente distincte în k grupe nevide, fără ordine între grupe?'
          : 'În câte moduri se scrie n ca sumă de numere întregi pozitive, fără a ține cont de ordinea termenilor?'}</p>
      </div><span className="heading-symbol" aria-hidden="true">{isStirling ? 'S' : 'p'}</span>
    </header>
    <div className="table-toolbar">
      <div className="number-table-definition"><Formula tex={notation}/><span>rânduri: n · coloane: k</span></div>
      <div className="parameters">
        {!isStirling && <label className="partition-mode">Părți
          <select aria-label="Tipul partițiilor" value={mode} onChange={e => setMode(e.target.value as 'exact' | 'atMost')}>
            <option value="exact">Exact k</option><option value="atMost">Cel mult k</option>
          </select>
        </label>}
        <label>Până la <i>n</i> = <input type="number" min="0" max="20" aria-label="Valoarea maximă a lui n" value={limit} onChange={e => setLimit(Math.max(0, Math.min(20, Math.floor(Number(e.target.value)) || 0)))}/></label>
      </div>
    </div>
    <div className="table-scroll number-table-scroll" tabIndex={0} aria-label={isStirling ? 'Tabel Stirling, derulabil orizontal' : 'Tabel de partiții întregi, derulabil orizontal'}>
      <table className="number-table">
        <caption>{isStirling ? 'Numere Stirling S(n,k)' : mode === 'exact' ? 'Partiții întregi în exact k părți' : 'Partiții întregi în cel mult k părți'}, n și k de la 0 la {limit}</caption>
        <thead><tr><th scope="col">n \ k</th>{indices.map(k => <th scope="col" key={k}>{k}</th>)}<th scope="col" className="total-column"><Formula tex={isStirling ? 'B_n' : 'p(n)'}/></th></tr></thead>
        <tbody>{indices.map(n => <tr key={n}>
          <th scope="row">{n}</th>
          {indices.map(k => { const result = value(n, k); return <td key={k} className={result === 0n ? 'zero-value' : undefined} title={`${isStirling ? 'S' : mode === 'exact' ? 'p exact' : 'p cel mult'}(${n}, ${k}) = ${result}`}>{String(result)}</td>; })}
          <td className="total-column">{String(isStirling ? bell(n) : partitionsAtMost(n, n))}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="table-note">Toate valorile sunt calculate exact. {isStirling ? 'Ultima coloană conține numerele Bell: suma valorilor de pe rând.' : mode === 'exact' ? 'Ultima coloană, p(n), este numărul total de partiții ale lui n: suma valorilor de pe rând.' : 'Ultima coloană, p(n), este numărul total de partiții ale lui n. Nu se adună valorile cumulative de pe rând.'}</p>
    <section className="table-explanations" aria-label="Explicația tabelului">
      <div><h2>{isStirling ? 'Cum se construiește tabelul' : 'Relația de recurență'}</h2>
        <Formula block tex={isStirling ? 'S(n,k)=k\\,S(n-1,k)+S(n-1,k-1)' : 'p_k(n)=p_k(n-k)+p_{k-1}(n-1)'}/>
        <p>{isStirling ? 'Ultimul element fie intră într-una dintre cele k grupe existente, fie formează singur o grupă nouă. Pentru n ≥ 1 și 1 ≤ k ≤ n, cele două situații dau termenii recurenței.' : 'Pentru n ≥ 1 și 1 ≤ k ≤ n: dacă toate cele k părți sunt cel puțin 2, scădem 1 din fiecare. Dacă există o parte egală cu 1, eliminăm o singură astfel de parte. Cele două situații sunt disjuncte.'}</p>
        {!isStirling && <><Formula block tex="p_{\le k}(n)=\sum_{j=0}^{k}p_j(n)"/><p>„Cel mult k” adună cazurile cu 0, 1, …, k părți. Pentru k ≥ n, această valoare este p(n).</p></>}
      </div>
      <div><h2>{isStirling ? 'Un exemplu: S(4,2) = 7' : 'Un exemplu: p(5) = 7'}</h2>
        {isStirling ? <><p>Partițiile mulțimii {'{1, 2, 3, 4}'} în două grupe nevide:</p><ul className="partition-examples">
          {['{1} | {2, 3, 4}', '{2} | {1, 3, 4}', '{3} | {1, 2, 4}', '{4} | {1, 2, 3}', '{1, 2} | {3, 4}', '{1, 3} | {2, 4}', '{1, 4} | {2, 3}'].map(example => <li key={example}>{example}</li>)}
        </ul><p>Schimbarea ordinii grupelor nu creează o partiție nouă.</p></> : <><ul className="partition-examples">
          {['5', '4 + 1', '3 + 2', '3 + 1 + 1', '2 + 2 + 1', '2 + 1 + 1 + 1', '1 + 1 + 1 + 1 + 1'].map(example => <li key={example}>{example}</li>)}
        </ul><p>În exact 3 părți: 3 + 1 + 1 și 2 + 2 + 1, deci <Formula tex="p_3(5)=2"/>. În cel mult 3 părți avem primele cinci partiții, deci <Formula tex="p_{\le3}(5)=5"/>.</p></>}
      </div>
    </section>
    <footer><p>{isStirling ? <><Formula tex="S(0,0)=1"/>: mulțimea vidă are o singură partiție în zero grupe. Pentru n &gt; 0, <Formula tex="S(n,0)=0"/>; pentru k &gt; n, <Formula tex="S(n,k)=0"/>.</> : <><Formula tex="p_0(0)=1"/>: partiția vidă este unică. Pentru n &gt; 0, <Formula tex="p_0(n)=0"/>. Zero nu are părți pozitive, deci <Formula tex="p_k(0)=0"/> pentru k &gt; 0, dar <Formula tex="p_{\le k}(0)=1"/>.</>}</p>
      <p>{isStirling ? <><Formula tex="B_n=\sum_{k=0}^{n}S(n,k)"/> numără toate partițiile unei mulțimi de n elemente distincte.</> : <>La partițiile întregi contează numai mărimile părților. La numerele Stirling contează și ce elemente distincte intră în fiecare grupă.</>}</p></footer>
  </main>;
}
