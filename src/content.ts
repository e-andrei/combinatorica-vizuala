import { type Case, kinds, names } from './math';
export const combinations = [
  { ballsDistinct: true, boxesDistinct: true, label: 'Distincte / distincte' },
  { ballsDistinct: true, boxesDistinct: false, label: 'Distincte / identice' },
  { ballsDistinct: false, boxesDistinct: true, label: 'Identice / distincte' },
  { ballsDistinct: false, boxesDistinct: false, label: 'Identice / identice' },
];
export const cases = kinds.flatMap(kind => combinations.map(c => ({ ...c, kind })));
export const caseId = (c: Case) => `${c.kind}-${+c.ballsDistinct}${+c.boxesDistinct}`;
export const title = (c: Case) => `${names[c.kind]} · bile ${c.ballsDistinct ? 'distincte' : 'identice'}, cutii ${c.boxesDistinct ? 'distincte' : 'identice'}`;
const formulas = {
  arbitrary: ['r^n', '\\sum_{k=0}^{\\min(n,r)} S(n,k)', '\\binom{n+r-1}{r-1}', 'p_{\\le r}(n)'],
  injective: ['\\frac{r!}{(r-n)!}', '1', '\\binom{r}{n}', '1'],
  surjective: ['r!\\,S(n,r)', 'S(n,r)', '\\binom{n-1}{r-1}', 'p_r(n)'],
  bijective: ['n!', '1', '1', '1'],
};
export const formula = (c: Case) => formulas[c.kind][(c.ballsDistinct ? 0 : 2) + (c.boxesDistinct ? 0 : 1)];
export const condition = (c: Case) => c.kind === 'arbitrary' ? 'Oricâte bile într-o cutie; cutiile pot rămâne goale.' : c.kind === 'injective' ? 'Cel mult o bilă în fiecare cutie. Necesită n ≤ r.' : c.kind === 'surjective' ? 'Cel puțin o bilă în fiecare cutie. Necesită n ≥ r.' : 'Exact o bilă în fiecare cutie. Necesită n = r.';
export function proof(c: Case): string[] {
  if (c.kind === 'bijective') return ['Fiecare cutie trebuie să primească exact o bilă: numerele n și r trebuie să coincidă.', 'Pentru bile și cutii distincte, prima bilă are n alegeri, următoarea n−1, până la ultima: o alegere.', c.ballsDistinct && c.boxesDistinct ? 'Regula produsului dă n · (n−1) · … · 1 = n!.' : 'Dacă bilele sau cutiile sunt identice, toate permutările descriu aceeași configurație. Rămâne o singură distribuție.'];
  if (c.kind === 'injective') return ['Odată ocupată, o cutie nu mai poate primi o bilă. Dacă n > r, plasamentul este imposibil.', 'Cu toate obiectele distincte, avem r, apoi r−1, …, r−n+1 alegeri.', c.boxesDistinct ? c.ballsDistinct ? 'Înmulțirea alegerilor dă r!/(r−n)!.' : 'Fiecare alegere de n cutii este numărată de n! ori dacă etichetăm bilele. Împărțim la n!: obținem C(r,n).' : 'Cutiile nu au etichete. Există doar n cutii cu câte o bilă și r−n cutii goale; orice schimb de cutii păstrează configurația.'];
  if (c.ballsDistinct) return c.boxesDistinct
    ? c.kind === 'arbitrary'
      ? ['Prima bilă poate alege oricare dintre cele r cutii.', 'Alegerea următoarei bile este independentă: fiecare ramură se împarte în r ramuri.', 'După n bile sunt r · r · … · r = rⁿ frunze. Fiecare frunză este o distribuție.']
      : ['Împărțim cele n bile distincte în r grupe nevide: S(n,r) posibilități.', 'Atribuim celor r grupe etichetele cutiilor: r! posibilități.', 'Regula produsului dă r! S(n,r). Alternativ, includerea–excluderea elimină toate distribuțiile cu cutii goale.']
    : c.kind === 'arbitrary'
      ? ['Cutiile identice sunt grupe fără nume. Cutiile goale nu schimbă gruparea.', 'Cu exact k cutii ocupate avem S(n,k) partiții ale mulțimii bilelor.', 'Adunăm cazurile disjuncte k = 0, …, min(n,r). Nu împărțim pur și simplu rⁿ la r!, fiindcă numărul cutiilor goale variază.']
      : ['Fiecare cutie trebuie ocupată; avem exact r grupe nevide.', 'O distribuție este o partiție a mulțimii celor n bile în r blocuri, fără ordine între blocuri.', 'Acesta este chiar numărul Stirling S(n,r).'];
  if (c.boxesDistinct) return c.kind === 'arbitrary'
    ? ['Reprezentăm n bile identice prin n stele, în ordinea cutiilor.', 'Introducem r−1 bare. Barele consecutive sau de la capete reprezintă cutii goale.', 'Din n+r−1 poziții alegem r−1 poziții pentru bare: C(n+r−1,r−1).']
    : ['Punem mai întâi o bilă în fiecare dintre cele r cutii.', 'Rămân n−r bile de distribuit arbitrar; această operație este reversibilă.', 'Stars and Bars dă C((n−r)+r−1,r−1) = C(n−1,r−1).'];
  return c.kind === 'arbitrary'
    ? ['Nici bilele, nici cutiile nu au etichete. Contează numai mărimile grupelor.', 'Sortăm descrescător numerele de bile din cutiile ocupate. Suma lor este n.', 'Obținem o partiție întreagă a lui n în cel mult r părți pozitive: p≤r(n).']
    : ['Cutiile sunt toate ocupate, deci mărimile lor sunt r numere pozitive cu suma n.', 'Sortarea descrescătoare elimină permutările cutiilor: avem pᵣ(n).', 'Ștergem câte o bilă din fiecare cutie. Rămâne o partiție a lui n−r în cel mult r părți. Inversa adaugă câte o bilă în r cutii, inclusiv cele goale.'];
}
