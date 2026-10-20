import { describe, expect, it } from 'vitest';
import { bell, choose, count, factorial, partitionsAtMost, partitionsExact, stirling } from './math';
import { cases } from './content';
import { canonical, enumerate, validate, ENUMERATION_LIMIT } from './configurations';
describe('valori cunoscute și domeniu', () => {
  it('calcule exacte', () => {
    expect(factorial(20)).toBe(2432902008176640000n);
    expect(choose(100, 50)).toBe(100891344545564193334812497256n);
    expect(stirling(4, 2)).toBe(7n); expect(bell(5)).toBe(52n);
    expect(partitionsAtMost(5, 3)).toBe(5n); expect(partitionsExact(5, 3)).toBe(2n);
    expect(() => factorial(-1)).toThrow(); expect(() => stirling(2.5, 1)).toThrow();
  });
  it('convenții vide', () => {
    for (const c of cases) {
      expect(count(0, 0, c)).toBe(1n); expect(count(1, 0, c)).toBe(0n);
      expect(count(0, 2, c)).toBe(c.kind === 'arbitrary' || c.kind === 'injective' ? 1n : 0n);
    }
  });
});
describe('întregul domeniu al simulatorului', () => {
  it('enumeră exact cazurile sub prag și respinge imediat cazurile mari', () => {
    for (const c of cases) for (let n = 0; n <= 8; n++) for (let r = 0; r <= 6; r++) {
      const expected = count(n, r, c);
      if (expected > BigInt(ENUMERATION_LIMIT)) {
        expect(() => enumerate(n, r, c)).toThrow(RangeError);
      } else {
        const all = enumerate(n, r, c);
        expect(BigInt(all.length)).toBe(expected);
        expect(new Set(all.map(g => canonical(g, c))).size).toBe(all.length);
        expect(all.every(g => validate(g, n, c).valid)).toBe(true);
      }
    }
  });
  it('respinge bile lipsă, repetate și restricții încălcate', () => {
    expect(validate([[0, 0]], 2, cases[0]).valid).toBe(false);
    expect(validate([[0]], 2, cases[0]).valid).toBe(false);
    expect(validate([[0, 1], []], 2, cases[4]).valid).toBe(false);
    expect(validate([[0, 1], []], 2, cases[8]).valid).toBe(false);
    expect(validate([[0], [1]], 2, cases[12]).valid).toBe(true);
  });
});
describe('formule vs enumerare exhaustivă independentă', () => {
  for (const c of cases) it(JSON.stringify(c), () => {
    for (let n = 0; n <= 5; n++) for (let r = 0; r <= 4; r++) {
      // Independent brute-force labeled placements then quotient by identities.
      const unique = new Set<string>();
      const boxes: number[][] = Array.from({ length: r }, () => []);
      const visit = (i: number) => {
        if (i === n) { if (validate(boxes, n, c).valid) unique.add(canonical(boxes, c)); return; }
        for (let j = 0; j < r; j++) { boxes[j].push(i); visit(i + 1); boxes[j].pop(); }
      };
      visit(0);
      expect(count(n, r, c)).toBe(BigInt(unique.size));
      const generated = enumerate(n, r, c);
      expect(new Set(generated.map(g => canonical(g, c)))).toEqual(unique);
      expect(generated.length).toBe(unique.size);
    }
  });
});
