import { count, type Case } from './math';
export type Configuration = number[][];
export const ENUMERATION_LIMIT = 1200;
export function canonical(boxes: Configuration, c: Case): string {
  const groups = boxes.map(g => c.ballsDistinct ? [...g].sort((a, b) => a - b).join(',') : String(g.length));
  if (!c.boxesDistinct) groups.sort();
  return JSON.stringify(groups);
}
export function validate(boxes: Configuration, n: number, c: Case): { valid: boolean; reason: string } {
  const all = boxes.flat();
  if (all.length !== n || new Set(all).size !== n || all.some(i => i < 0 || i >= n))
    return { valid: false, reason: 'Așază fiecare bilă într-o cutie. Bilele de pe raft nu sunt încă distribuite.' };
  if ((c.kind === 'injective' || c.kind === 'bijective') && boxes.some(g => g.length > 1))
    return { valid: false, reason: 'O cutie conține mai multe bile. Este permisă cel mult una.' };
  if ((c.kind === 'surjective' || c.kind === 'bijective') && boxes.some(g => g.length === 0))
    return { valid: false, reason: 'Există cutii goale. Fiecare cutie trebuie să primească o bilă.' };
  return { valid: true, reason: n === 0 && boxes.length === 0 ? 'Distribuția vidă este unică și validă.' : 'Toate bilele sunt plasate, iar condiția este respectată.' };
}
/** Generate canonical representatives directly, avoiding the r^n raw assignment space. */
export function enumerate(n: number, r: number, c: Case): Configuration[] {
  if (count(n, r, c) > BigInt(ENUMERATION_LIMIT)) throw new RangeError('Prea multe configurații pentru galerie.');
  const out: Configuration[] = [], boxes: Configuration = Array.from({ length: r }, () => []);
  if (!c.ballsDistinct) {
    const sizes = Array<number>(r).fill(0);
    function compositions(pos: number, left: number, max: number) {
      if (pos === r) {
        if (left !== 0) return;
        let id = 0; const groups = sizes.map(s => Array.from({ length: s }, () => id++));
        if (validate(groups, n, c).valid) out.push(groups);
        return;
      }
      const min = c.kind === 'surjective' || c.kind === 'bijective' ? 1 : 0;
      const cap = c.kind === 'injective' || c.kind === 'bijective' ? 1 : left;
      for (let size = min; size <= Math.min(left, cap, c.boxesDistinct ? left : max); size++) {
        sizes[pos] = size; compositions(pos + 1, left - size, size);
      }
    }
    compositions(0, n, n);
  } else {
    function place(ball: number, used: number) {
      if (ball === n) { if (validate(boxes, n, c).valid) out.push(boxes.map(g => [...g])); return; }
      const empty = boxes.filter(g => !g.length).length;
      if ((c.kind === 'surjective' || c.kind === 'bijective') && empty > n - ball) return;
      for (let j = 0; j < (c.boxesDistinct ? r : Math.min(r, used + 1)); j++) {
        if ((c.kind === 'injective' || c.kind === 'bijective') && boxes[j].length) continue;
        boxes[j].push(ball); place(ball + 1, Math.max(used, j + 1)); boxes[j].pop();
      }
    }
    place(0, 0);
  }
  return out;
}
