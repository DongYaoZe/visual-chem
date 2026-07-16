import { describe, expect, it } from 'vitest';
import { findInteriorRoots, solveBracketedRoot } from './root';

describe('solveBracketedRoot (Brent)', () => {
	it('solves the classic cubic to full tolerance', () => {
		const root = solveBracketedRoot((x) => x ** 3 - 2 * x - 5, 2, 3, { tolerance: 1e-12 });
		expect(root).toBeCloseTo(2.0945514815423265, 12);
	});

	it('returns an endpoint that already satisfies the tolerance', () => {
		expect(solveBracketedRoot((x) => x - 2, 2, 3)).toBe(2);
		expect(solveBracketedRoot((x) => x - 3, 2, 3)).toBe(3);
	});

	it('rejects an unbracketed interval', () => {
		expect(() => solveBracketedRoot((x) => x * x + 1, -1, 1)).toThrow(/not bracketed/);
	});

	it('rejects non-finite evaluations', () => {
		expect(() => solveBracketedRoot((x) => Math.log(x), -1, 1)).toThrow(/non-finite/);
	});

	it('converges superlinearly where bisection would grind', () => {
		let evaluations = 0;
		const counted = (x: number) => {
			evaluations += 1;
			return Math.cos(x) - x;
		};
		const root = solveBracketedRoot(counted, 0, 1, { tolerance: 1e-13 });
		expect(root).toBeCloseTo(0.7390851332151607, 12);
		// Bisection needs ~44 evaluations to reach 1e-13 on a unit interval.
		expect(evaluations).toBeLessThan(15);
	});

	it('handles a root sitting hard against machine precision', () => {
		const root = solveBracketedRoot((x) => Math.expm1(x), -0.5, 1, { tolerance: 1e-15 });
		expect(Math.abs(root)).toBeLessThan(1e-9);
	});
});

describe('findInteriorRoots', () => {
	it('finds every interior sign change and skips the endpoints', () => {
		const roots = findInteriorRoots((x) => Math.sin(3 * Math.PI * x), 0, 1, 240);
		expect(roots).toHaveLength(2);
		expect(roots[0]).toBeCloseTo(1 / 3, 9);
		expect(roots[1]).toBeCloseTo(2 / 3, 9);
	});
});
