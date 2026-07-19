import { describe, expect, it } from 'vitest';
import {
	AVOGADRO_PER_MOL,
	MOLAR_MIXING_ENTROPY_J_PER_K,
	centralFraction,
	ehrenfestTrajectory,
	leftCountProbability,
	lnBinomial,
	lnFactorial,
	lnMultiplicity,
	multiplicityDistribution
} from './microstates';

describe('lnFactorial', () => {
	it('matches exact factorials below the Stirling switch', () => {
		expect(lnFactorial(0)).toBe(0);
		expect(lnFactorial(1)).toBe(0);
		expect(lnFactorial(5)).toBeCloseTo(Math.log(120), 12);
		expect(lnFactorial(10)).toBeCloseTo(Math.log(3628800), 12);
	});

	it('is continuous across the Stirling switch at n = 32', () => {
		// Compare Stirling at 32 against exact summation.
		let exact = 0;
		for (let k = 2; k <= 32; k += 1) exact += Math.log(k);
		expect(lnFactorial(32)).toBeCloseTo(exact, 6);
	});

	it('rejects non-natural input', () => {
		expect(() => lnFactorial(-1)).toThrow(/natural/);
		expect(() => lnFactorial(2.5)).toThrow(/natural/);
	});
});

describe('lnBinomial and multiplicity', () => {
	it('reproduces small binomial coefficients exactly', () => {
		expect(Math.exp(lnBinomial(4, 2))).toBeCloseTo(6, 10);
		expect(Math.exp(lnBinomial(10, 5))).toBeCloseTo(252, 8);
		expect(Math.exp(lnMultiplicity(6, 3))).toBeCloseTo(20, 9);
	});

	it('is symmetric and peaks at the even split', () => {
		for (const [n, k] of [
			[100, 30],
			[100, 50],
			[201, 7]
		] as const) {
			expect(lnBinomial(n, k)).toBeCloseTo(lnBinomial(n, n - k), 9);
		}
		expect(lnBinomial(100, 50)).toBeGreaterThan(lnBinomial(100, 49));
		expect(lnBinomial(100, 49)).toBeGreaterThan(lnBinomial(100, 30));
	});

	it('rejects out-of-range counts', () => {
		expect(() => lnBinomial(10, 11)).toThrow(/undefined/);
		expect(() => lnBinomial(10, -1)).toThrow(/undefined/);
	});
});

describe('leftCountProbability', () => {
	it('normalizes to one', () => {
		for (const n of [10, 100, 400]) {
			let total = 0;
			for (let k = 0; k <= n; k += 1) total += leftCountProbability(n, k);
			expect(total).toBeCloseTo(1, 6);
		}
	});

	it('makes the all-left state astronomically rare as N grows', () => {
		expect(leftCountProbability(10, 10)).toBeCloseTo(Math.pow(2, -10), 12);
		expect(leftCountProbability(100, 100)).toBeCloseTo(Math.pow(2, -100), 40);
		// One mole: ln P = -N_A ln 2 — the story quotes the exponent.
		const lnP = -AVOGADRO_PER_MOL * Math.LN2;
		expect(lnP / Math.LN10).toBeCloseTo(-1.813e23, -20);
	});
});

describe('multiplicityDistribution', () => {
	it('collects the peak and the tail in one pass', () => {
		const distribution = multiplicityDistribution(100);
		expect(distribution.probabilities).toHaveLength(101);
		expect(distribution.lnPeak).toBeCloseTo(lnBinomial(100, 50), 12);
		expect(distribution.allLeftProbability).toBeCloseTo(Math.pow(2, -100), 40);
	});
});

describe('centralFraction', () => {
	it('captures the √N concentration of the peak', () => {
		// Within ±√N of the even split lives most of the distribution,
		// and the share grows tighter in relative terms as N grows.
		expect(centralFraction(100, 10)).toBeGreaterThan(0.95);
		expect(centralFraction(400, 20)).toBeGreaterThan(0.95);
		// A ±5 % window swallows almost everything at N = 400.
		expect(centralFraction(400, 20)).toBeGreaterThan(centralFraction(100, 5));
	});

	it('reaches one when the window spans everything', () => {
		expect(centralFraction(50, 50)).toBe(1);
	});
});

describe('molar mixing entropy', () => {
	it('is R ln 2 within double precision', () => {
		expect(MOLAR_MIXING_ENTROPY_J_PER_K).toBeCloseTo(5.7631, 4);
	});
});

describe('ehrenfestTrajectory', () => {
	it('is deterministic for a fixed seed', () => {
		const a = ehrenfestTrajectory(100, 500);
		const b = ehrenfestTrajectory(100, 500);
		expect(a).toEqual(b);
	});

	it('relaxes from all-left toward the even split', () => {
		const trajectory = ehrenfestTrajectory(100, 2000);
		expect(trajectory[0]).toBe(100);
		const tail = trajectory.slice(-500);
		const mean = tail.reduce((sum, v) => sum + v, 0) / tail.length;
		expect(mean).toBeGreaterThan(40);
		expect(mean).toBeLessThan(60);
		// It fluctuates — never freezes at exactly N/2.
		expect(new Set(tail).size).toBeGreaterThan(5);
	});

	it('steps by exactly one particle at a time', () => {
		const trajectory = ehrenfestTrajectory(60, 300);
		for (let i = 1; i < trajectory.length; i += 1) {
			expect(Math.abs(trajectory[i] - trajectory[i - 1])).toBe(1);
		}
	});
});
