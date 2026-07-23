import { describe, expect, it } from 'vitest';
import {
	C14_HALF_LIFE_A,
	c14AgeYears,
	concentrationAt,
	decayCurve,
	halfLife,
	peroxideParticleCounts,
	rateAt,
	successiveHalfLives
} from './kinetics';

describe('concentrationAt', () => {
	it('integrates each order correctly', () => {
		// Zero order: linear ramp to zero, clamped.
		expect(concentrationAt(0, 1, 0.01, 50)).toBeCloseTo(0.5, 12);
		expect(concentrationAt(0, 1, 0.01, 200)).toBe(0);
		// First order: exponential.
		expect(concentrationAt(1, 1, Math.LN2 / 100, 100)).toBeCloseTo(0.5, 12);
		expect(concentrationAt(1, 2, Math.LN2 / 100, 300)).toBeCloseTo(0.25, 12);
		// Second order: 1/c linear in t.
		expect(concentrationAt(2, 1, 0.01, 100)).toBeCloseTo(0.5, 12);
		expect(concentrationAt(2, 1, 0.01, 300)).toBeCloseTo(0.25, 12);
	});

	it('rejects nonsense input', () => {
		expect(() => concentrationAt(1, 0, 1, 1)).toThrow(/positive/);
		expect(() => concentrationAt(1, 1, -1, 1)).toThrow(/positive/);
		expect(() => concentrationAt(1, 1, 1, -1)).toThrow(/non-negative/);
	});
});

describe('rateAt', () => {
	it('scales with concentration by order', () => {
		expect(rateAt(0, 0.5, 0.02)).toBe(0.02);
		expect(rateAt(0, 0, 0.02)).toBe(0);
		expect(rateAt(1, 0.5, 0.02)).toBeCloseTo(0.01, 12);
		expect(rateAt(2, 0.5, 0.02)).toBeCloseTo(0.005, 12);
		// Halving c: order 0 unchanged, order 1 halves, order 2 quarters.
		expect(rateAt(2, 0.25, 0.02) / rateAt(2, 0.5, 0.02)).toBeCloseTo(0.25, 12);
	});
});

describe('halfLife fingerprints', () => {
	it('only first order ignores the starting concentration', () => {
		const k = 0.01;
		expect(halfLife(1, 1, k)).toBeCloseTo(halfLife(1, 0.1, k), 12);
		expect(halfLife(0, 1, k)).not.toBeCloseTo(halfLife(0, 0.5, k), 6);
		expect(halfLife(2, 1, k)).not.toBeCloseTo(halfLife(2, 0.5, k), 6);
	});

	it('successive half-lives: constant / shrinking / doubling', () => {
		const first = successiveHalfLives(1, 1, 0.01);
		expect(first[1] / first[0]).toBeCloseTo(1, 9);
		expect(first[2] / first[1]).toBeCloseTo(1, 9);
		const zero = successiveHalfLives(0, 1, 0.01);
		expect(zero[1] / zero[0]).toBeCloseTo(0.5, 9);
		const second = successiveHalfLives(2, 1, 0.01);
		expect(second[1] / second[0]).toBeCloseTo(2, 9);
		expect(second[2] / second[1]).toBeCloseTo(2, 9);
	});
});

describe('decayCurve', () => {
	it('samples the window and marks cumulative half-life times', () => {
		const k = Math.LN2 / 100; // t1/2 = 100 s
		const curve = decayCurve(1, 1, k, 400);
		expect(curve.times[0]).toBe(0);
		expect(curve.times[curve.times.length - 1]).toBe(400);
		expect(curve.concentrations[0]).toBeCloseTo(1, 12);
		expect(curve.halfLifeMarks).toHaveLength(3);
		expect(curve.halfLifeMarks[0]).toBeCloseTo(100, 6);
		expect(curve.halfLifeMarks[1]).toBeCloseTo(200, 6);
		expect(curve.halfLifeMarks[2]).toBeCloseTo(300, 6);
	});

	it('drops marks beyond the plotted window', () => {
		const curve = decayCurve(1, 1, Math.LN2 / 100, 150);
		expect(curve.halfLifeMarks).toHaveLength(1);
	});
});

describe('peroxide particle bookkeeping', () => {
	it('preserves 2 H2O2 -> 2 H2O + O2 at every snapped frame', () => {
		for (const fraction of [1, 0.83, 0.5, 0.12, 0]) {
			const counts = peroxideParticleCounts(fraction, 20);
			expect(counts.reactant % 2).toBe(0);
			expect(counts.water).toBe(20 - counts.reactant);
			expect(counts.oxygen).toBe(counts.water / 2);
			// Oxygen atoms: 2 per remaining peroxide + 1 per water + 2 per oxygen.
			expect(2 * counts.reactant + counts.water + 2 * counts.oxygen).toBe(40);
		}
		expect(peroxideParticleCounts(0.5, 20)).toEqual({
			reactant: 10,
			water: 10,
			oxygen: 5
		});
	});

	it('rejects fractions and particle pools that cannot represent the reaction', () => {
		expect(() => peroxideParticleCounts(-0.1)).toThrow(/fraction/);
		expect(() => peroxideParticleCounts(1.1)).toThrow(/fraction/);
		expect(() => peroxideParticleCounts(0.5, 19)).toThrow(/even integer/);
	});
});

describe('carbon-14 anchor', () => {
	it('uses the Cambridge half-life and inverts cleanly', () => {
		expect(C14_HALF_LIFE_A).toBe(5730);
		expect(c14AgeYears(0.5)).toBeCloseTo(5730, 6);
		expect(c14AgeYears(0.25)).toBeCloseTo(11460, 6);
		expect(c14AgeYears(1)).toBe(0);
		// Ötzi the Iceman: ~53% remaining → ~5300 years.
		expect(c14AgeYears(0.526)).toBeGreaterThan(5100);
		expect(c14AgeYears(0.526)).toBeLessThan(5500);
	});

	it('rejects fractions outside (0, 1]', () => {
		expect(() => c14AgeYears(0)).toThrow(/fraction/);
		expect(() => c14AgeYears(1.2)).toThrow(/fraction/);
	});
});
