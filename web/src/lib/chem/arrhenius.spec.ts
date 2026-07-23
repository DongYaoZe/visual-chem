import { describe, expect, it } from 'vitest';
import {
	arrheniusFactor,
	dolbearChirpsPerMinute,
	doublingRiseK,
	eaFromTwoPoints,
	mbDistribution,
	rateRatio,
	tailFraction
} from './arrhenius';

describe('arrheniusFactor', () => {
	it('is a vanishing fraction at classroom barriers', () => {
		// Ea = 50 kJ/mol at 298 K: about 1.7e-9 of collisions have the energy.
		const f = arrheniusFactor(50, 298.15);
		expect(f).toBeGreaterThan(1e-9);
		expect(f).toBeLessThan(3e-9);
	});

	it('grows with temperature and shrinks with barrier height', () => {
		expect(arrheniusFactor(50, 308.15)).toBeGreaterThan(arrheniusFactor(50, 298.15));
		expect(arrheniusFactor(80, 298.15)).toBeLessThan(arrheniusFactor(50, 298.15));
	});
});

describe('the doubles-per-10-K rule, made honest', () => {
	it('holds near Ea = 53 kJ/mol at room temperature', () => {
		// The rule of thumb is exact only for one Ea at one T.
		const ratio = rateRatio(53, 298.15, 308.15);
		expect(ratio).toBeGreaterThan(1.9);
		expect(ratio).toBeLessThan(2.1);
	});

	it('fails for other barriers — the story debunks the universal rule', () => {
		expect(rateRatio(20, 298.15, 308.15)).toBeLessThan(1.4);
		expect(rateRatio(120, 298.15, 308.15)).toBeGreaterThan(4);
	});

	it('doublingRiseK inverts rateRatio', () => {
		const rise = doublingRiseK(53, 298.15);
		expect(rateRatio(53, 298.15, 298.15 + rise)).toBeCloseTo(2, 6);
		// Higher barriers need a smaller rise.
		expect(doublingRiseK(120, 298.15)).toBeLessThan(rise);
	});
});

describe('mbDistribution', () => {
	it('normalizes to unit area at any temperature', () => {
		for (const tau of [0.8, 1, 1.4]) {
			const { xs, ys } = mbDistribution(tau);
			let area = 0;
			for (let index = 1; index < xs.length; index += 1) {
				area += ((ys[index] + ys[index - 1]) / 2) * (xs[index] - xs[index - 1]);
			}
			expect(area).toBeCloseTo(1, 6);
		}
	});

	it('hotter curves are lower and broader with a right-shifted peak', () => {
		const cold = mbDistribution(1);
		const hot = mbDistribution(1.4);
		const peak = (d: { xs: readonly number[]; ys: readonly number[] }) => {
			let best = 0;
			for (let index = 1; index < d.ys.length; index += 1) {
				if (d.ys[index] > d.ys[best]) best = index;
			}
			return { x: d.xs[best], y: d.ys[best] };
		};
		expect(peak(hot).y).toBeLessThan(peak(cold).y);
		expect(peak(hot).x).toBeGreaterThan(peak(cold).x);
	});
});

describe('tailFraction', () => {
	it('is the Arrhenius exponential and explodes with temperature', () => {
		expect(tailFraction(50, 298.15)).toBeCloseTo(arrheniusFactor(50, 298.15), 15);
		// The story's punchline: +10 K doubles the tail, not the average speed.
		expect(tailFraction(53, 308.15) / tailFraction(53, 298.15)).toBeGreaterThan(1.9);
	});
});

describe('eaFromTwoPoints', () => {
	it('round-trips a known barrier', () => {
		const ea = 62;
		const k1 = arrheniusFactor(ea, 293.15);
		const k2 = arrheniusFactor(ea, 313.15);
		expect(eaFromTwoPoints(293.15, k1, 313.15, k2)).toBeCloseTo(ea, 8);
	});

	it('rejects equal temperatures', () => {
		expect(() => eaFromTwoPoints(300, 1, 300, 2)).toThrow(/differ/);
	});
});

describe('dolbearChirpsPerMinute', () => {
	it('matches Dolbear’s law anchors', () => {
		// 60 chirps/min at 55 °F ≈ 12.8 °C.
		expect(dolbearChirpsPerMinute(12.8)).toBeCloseTo(60, 0);
		expect(dolbearChirpsPerMinute(25)).toBeGreaterThan(100);
		expect(dolbearChirpsPerMinute(-5)).toBe(0);
	});
});
