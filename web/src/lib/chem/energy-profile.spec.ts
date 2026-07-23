import { describe, expect, it } from 'vitest';
import { arrheniusFactor } from './arrhenius';
import {
	H2O2_BARRIERS_KJ,
	H2O2_DELTA_H_KJ,
	accelerationFactor,
	barriers,
	catalyzedProfile,
	uncatalyzedProfile
} from './energy-profile';

describe('uncatalyzedProfile', () => {
	it('starts at zero, peaks at Ea, ends at ΔH', () => {
		const profile = uncatalyzedProfile(73, -98);
		expect(profile[0].e).toBe(0);
		expect(profile[profile.length - 1].e).toBe(-98);
		expect(Math.max(...profile.map((p) => p.e))).toBeCloseTo(73, 6);
	});

	it('is monotone up then monotone down for an exothermic reaction', () => {
		const profile = uncatalyzedProfile(73, -98);
		const peakIndex = profile.findIndex((p) => p.e === Math.max(...profile.map((q) => q.e)));
		for (let index = 1; index <= peakIndex; index += 1) {
			expect(profile[index].e).toBeGreaterThanOrEqual(profile[index - 1].e - 1e-9);
		}
		for (let index = peakIndex + 1; index < profile.length; index += 1) {
			expect(profile[index].e).toBeLessThanOrEqual(profile[index - 1].e + 1e-9);
		}
	});

	it('rejects a summit below the valleys', () => {
		expect(() => uncatalyzedProfile(-5, -98)).toThrow(/summit/);
		expect(() => uncatalyzedProfile(10, 20)).toThrow(/summit/);
	});
});

describe('catalyzedProfile', () => {
	it('keeps both valleys exactly where they were', () => {
		const plain = uncatalyzedProfile(73, -98);
		const catalyzed = catalyzedProfile(56, -98);
		expect(catalyzed[0].e).toBe(plain[0].e);
		expect(catalyzed[catalyzed.length - 1].e).toBe(plain[plain.length - 1].e);
	});

	it('lowers the pass below the uncatalyzed summit', () => {
		const catalyzed = catalyzedProfile(56, -98);
		expect(Math.max(...catalyzed.map((p) => p.e))).toBeLessThan(73);
		expect(Math.max(...catalyzed.map((p) => p.e))).toBeCloseTo(56, 0);
	});

	it('shows an intermediate dip between two bumps', () => {
		const catalyzed = catalyzedProfile(56, -98);
		const inner = catalyzed.filter((p) => p.x > 0.35 && p.x < 0.62);
		const dip = Math.min(...inner.map((p) => p.e));
		expect(dip).toBeLessThan(56);
		expect(dip).toBeGreaterThan(-98);
	});
});

describe('barriers', () => {
	it('reverse barrier is forward minus ΔH', () => {
		const { forward, reverse } = barriers(73, -98);
		expect(forward).toBe(73);
		expect(reverse).toBe(171);
		// Endothermic case.
		expect(barriers(80, 30).reverse).toBe(50);
	});
});

describe('accelerationFactor — the equal-boost theorem', () => {
	it('matches the Arrhenius ratio and is huge for catalase', () => {
		const T = 298.15;
		const boost = accelerationFactor(H2O2_BARRIERS_KJ.uncatalyzed, H2O2_BARRIERS_KJ.iodide, T);
		expect(boost).toBeCloseTo(
			arrheniusFactor(H2O2_BARRIERS_KJ.iodide, T) /
				arrheniusFactor(H2O2_BARRIERS_KJ.uncatalyzed, T),
			9
		);
		// Iodide: about a thousand-fold; catalase: over 10^10.
		expect(boost).toBeGreaterThan(500);
		expect(boost).toBeLessThan(5000);
		expect(
			accelerationFactor(H2O2_BARRIERS_KJ.uncatalyzed, H2O2_BARRIERS_KJ.catalase, T)
		).toBeGreaterThan(1e10);
	});

	it('boosts forward and reverse identically, leaving K untouched', () => {
		const T = 310;
		const dH = H2O2_DELTA_H_KJ;
		const before = barriers(73, dH);
		const after = barriers(56, dH);
		const forwardBoost = accelerationFactor(before.forward, after.forward, T);
		const reverseBoost = accelerationFactor(before.reverse, after.reverse, T);
		expect(forwardBoost).toBeCloseTo(reverseBoost, 9);
	});
});
