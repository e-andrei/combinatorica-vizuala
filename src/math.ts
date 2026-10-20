export type Kind = 'arbitrary' | 'injective' | 'surjective' | 'bijective';
export type Case = { kind: Kind; ballsDistinct: boolean; boxesDistinct: boolean };
export const kinds: Kind[] = ['arbitrary', 'injective', 'surjective', 'bijective'];
export const names: Record<Kind, string> = { arbitrary: 'Arbitrar', injective: 'Injectiv', surjective: 'Surjectiv', bijective: 'Bijectiv' };
export function natural(n: number) { if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Se cere un întreg nenegativ.'); }
export function factorial(n: number): bigint { natural(n); let v = 1n; for (let i = 2; i <= n; i++) v *= BigInt(i); return v; }
export function choose(n: number, k: number): bigint {
  natural(n); natural(k); if (k > n) return 0n;
  let v = 1n; k = Math.min(k, n - k);
  for (let i = 1; i <= k; i++) v = v * BigInt(n - k + i) / BigInt(i);
  return v;
}
export function stirling(n: number, r: number): bigint {
  natural(n); natural(r); if (r > n) return 0n;
  const a = Array<bigint>(r + 1).fill(0n); a[0] = 1n;
  for (let i = 1; i <= n; i++) { for (let k = r; k >= 1; k--) a[k] = BigInt(k) * a[k] + a[k - 1]; a[0] = 0n; }
  return a[r];
}
export function bell(n: number): bigint { natural(n); return Array.from({ length: n + 1 }, (_, k) => stirling(n, k)).reduce((a, b) => a + b, 0n); }
export function partitionsAtMost(n: number, r: number): bigint {
  natural(n); natural(r);
  const dp = Array<bigint>(n + 1).fill(0n); dp[0] = 1n;
  // Ferrers conjugation: at most r parts ↔ parts of size at most r.
  for (let k = 1; k <= Math.min(n, r); k++) for (let i = k; i <= n; i++) dp[i] += dp[i - k];
  return dp[n];
}
export function partitionsExact(n: number, r: number): bigint {
  natural(n); natural(r); if (r === 0) return n === 0 ? 1n : 0n;
  return n < r ? 0n : partitionsAtMost(n - r, r);
}
export function count(n: number, r: number, c: Case): bigint {
  natural(n); natural(r);
  if (r === 0) return n === 0 ? 1n : 0n;
  if (c.kind === 'injective' && n > r || c.kind === 'surjective' && n < r || c.kind === 'bijective' && n !== r) return 0n;
  const { ballsDistinct: b, boxesDistinct: x } = c;
  if (c.kind === 'bijective') return b && x ? factorial(n) : 1n;
  if (c.kind === 'injective') return x ? b ? factorial(r) / factorial(r - n) : choose(r, n) : 1n;
  if (c.kind === 'surjective') return b ? stirling(n, r) * (x ? factorial(r) : 1n) : x ? choose(n - 1, r - 1) : partitionsExact(n, r);
  return b ? x ? BigInt(r) ** BigInt(n) : Array.from({ length: Math.min(n, r) + 1 }, (_, k) => stirling(n, k)).reduce((a, v) => a + v, 0n) : x ? choose(n + r - 1, r - 1) : partitionsAtMost(n, r);
}
